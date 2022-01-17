import { DataFunctionArgs } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { getDiscojs } from "~/util/auth.server";
import { getPagination } from "~/util/pagination";
import { primaryOrFirstImage } from "~/util/release";

// anti-colocation but fixes esbuild import problems

export const loader = async ({ params, request }: DataFunctionArgs) => {
  const id = Number(params.id);
  invariant(typeof id === "number", "expected params.id");

  const client = await getDiscojs(request);

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
