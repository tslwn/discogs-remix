import { DataFunctionArgs } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { getDiscogsClient } from "~/util/auth.server";
import {
  ArtistRelease,
  ArtistReleaseRole,
  ReleaseSortField,
  SortOrder,
} from "~/util/discogs";
import { getPagination } from "~/util/pagination";
import { primaryOrFirstImage } from "~/util/release";

// anti-colocation but fixes esbuild import problems

function releasesByRole(releases: ArtistRelease[]) {
  const releasesByRole = new Map<
    ArtistReleaseRole,
    Omit<ArtistRelease, "role">[]
  >();

  for (const release of releases) {
    const role = releasesByRole.get(release.role);
    if (role === undefined) {
      releasesByRole.set(release.role, [release]);
    } else {
      role.push(release);
    }
  }

  return Array.from(releasesByRole, ([role, releases]) => ({
    role: displayRole(role),
    releases,
  }));
}

function displayRole(role: ArtistReleaseRole): string {
  switch (role) {
    case "TrackAppearance":
      return "Track appearance";
    case "UnofficialRelease":
      return "Unofficial release";
    default:
      return role;
  }
}

export const loader = async ({ params, request }: DataFunctionArgs) => {
  const id = Number(params.id);
  invariant(typeof id === "number", "expected params.id");

  const client = await getDiscogsClient(request);

  const { page, perPage } = getPagination(request);

  const [artist, { pagination, releases }] = await Promise.all([
    client.getArtist(id),
    client.getArtistReleases(id, {
      page,
      per_page: perPage,
      sort: ReleaseSortField.YEAR,
      sort_order: SortOrder.ASC,
    }),
  ]);

  return {
    id,
    name: artist.name,
    src: primaryOrFirstImage(artist.images)?.uri,
    members: artist.members?.map(({ active, id, name }) => ({
      active,
      id,
      name,
    })),
    releases: {
      pagination: {
        items: pagination.items,
        page: pagination.page,
        perPage: pagination.per_page,
      },
      releases: releasesByRole(releases),
    },
  };
};

export type LoaderData = Awaited<ReturnType<typeof loader>>;
