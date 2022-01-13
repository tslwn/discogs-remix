import { DataFunctionArgs } from "@remix-run/server-runtime";
import { ReleaseSortEnum, SortOrdersEnum } from "discojs";
import invariant from "tiny-invariant";
import { getDiscogsClient } from "~/util/auth.server";
import { getPagination } from "~/util/pagination";
import { primaryOrFirstImage } from "~/util/release";

// anti-colocation but fixes esbuild import problems

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

  console.log(artist);

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
      releases: releases.map(
        // @ts-ignore type does exist
        ({ artist, id, thumb, title, type, year }) => ({
          artist,
          id,
          thumb,
          title,
          type,
          year,
        })
      ),
    },
  };
};

export type LoaderData = Awaited<ReturnType<typeof loader>>;
