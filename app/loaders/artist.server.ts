import { DataFunctionArgs } from "@remix-run/server-runtime";
import { ReleaseSortEnum, SortOrdersEnum } from "discojs";
import invariant from "tiny-invariant";
import type { ArtistReleases, Role } from "~/types/discojs";
import { getDiscogsClient } from "~/util/auth.server";
import { getPagination } from "~/util/pagination";
import { primaryOrFirstImage } from "~/util/release";

// anti-colocation but fixes esbuild import problems

type Release = ArtistReleases["releases"][number] & { role: Role };

function releasesByRole(releases: Release[]) {
  const releasesByRole = new Map<Role, Omit<Release, "role">[]>();

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

function displayRole(role: Role): string {
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

  const [artist, { pagination, releases }] = await Promise.all([
    client.getArtist(id),
    client.getArtistReleases(
      id,
      {
        by: ReleaseSortEnum.YEAR,
        order: SortOrdersEnum.ASC,
      },
      getPagination(request)
    ),
  ]);

  return {
    id,
    // @ts-ignore name does exist
    name: artist.name,
    src: primaryOrFirstImage(artist.images)?.uri,
    releases: {
      pagination: {
        items: pagination.items,
        page: pagination.page,
        perPage: pagination.per_page,
      },
      releases: releasesByRole(releases as Release[]),
    },
  };
};

export type LoaderData = Awaited<ReturnType<typeof loader>>;
