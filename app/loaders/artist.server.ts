import { DataFunctionArgs } from "@remix-run/server-runtime";
import { ReleaseSortEnum, SortOrdersEnum } from "discojs";
import invariant from "tiny-invariant";
import type { Role } from "~/types/discojs";
import { getDiscogsClient } from "~/util/auth.server";
import { getPagination } from "~/util/pagination";
import { primaryOrFirstImage } from "~/util/release";

// anti-colocation but fixes esbuild import problems

function groupByRole<Element extends { role: Role }>(array: Element[]) {
  return array.reduce((grouped, element) => {
    const { role, ...rest } = element;
    grouped[role] = (grouped[role] || []).concat(rest);
    return grouped;
  }, {} as Record<Role, Omit<Element, "role">[]>);
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
      releases: groupByRole(
        releases.map(
          // @ts-ignore type does exist
          ({ artist, id, role, thumb, title, type, year }) => ({
            artist,
            id,
            role,
            thumb,
            title,
            type,
            year,
          })
        )
      ),
    },
  };
};

export type LoaderData = Awaited<ReturnType<typeof loader>>;
