import { DataFunctionArgs } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { getDiscogsClient } from "~/util/auth.server";
import { getPagination } from "~/util/pagination";
import { primaryOrFirstImage } from "~/util/release";

// anti-colocation but fixes esbuild import problems

export const loader = async ({ params, request }: DataFunctionArgs) => {
  const id = Number(params.id);
  invariant(typeof id === "number", "expected params.id");

  const client = await getDiscogsClient(request);

  const [{ images, name }, { pagination, releases }] = await Promise.all([
    client.getLabel(id),
    client.getLabelReleases(id, getPagination(request)),
  ]);

  return {
    label: {
      id,
      name,
      src: primaryOrFirstImage(images)?.uri,
    },
    releases: {
      pagination: {
        items: pagination.items,
        page: pagination.page,
        perPage: pagination.per_page,
      },
      releases: releases.map(({ artist, id, thumb, title, year }) => ({
        artist,
        id,
        thumb,
        title,
        year,
      })),
    },
  };
};

export type LoaderData = Awaited<ReturnType<typeof loader>>;
