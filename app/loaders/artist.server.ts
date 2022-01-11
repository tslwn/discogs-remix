import { ReleaseSortEnum, SortOrdersEnum } from "discojs";
import type { LoaderFunction } from "remix";
import invariant from "tiny-invariant";
import type { Artist, ArtistReleases } from "~/types/discojs";
import { getDiscogsClient } from "~/util/auth.server";
import { getPagination } from "~/util/pagination";

// anti-colocation but fixes esbuild import problems

export const loader: LoaderFunction = async ({ params, request }) => {
  const id = Number(params.id);
  invariant(typeof id === "number", "expected params.id");

  const pagination = getPagination(request);

  const client = await getDiscogsClient(request);

  return {
    artist: await client.getArtist(id),
    artistReleases: await client.getArtistReleases(
      id,
      {
        by: ReleaseSortEnum.YEAR,
        order: SortOrdersEnum.ASC,
      },
      pagination
    ),
  };
};

export type LoaderData = { artist: Artist & { name: string } } & {
  artistReleases: ArtistReleases;
};
