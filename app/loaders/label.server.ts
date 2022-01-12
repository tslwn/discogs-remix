import { DataFunctionArgs } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { getDiscogsClient } from "~/util/auth.server";
import { getPagination } from "~/util/pagination";
import { primaryOrFirstImage } from "~/util/release";

// anti-colocation but fixes esbuild import problems

export const loader = async ({ params, request }: DataFunctionArgs) => {
  const id = Number(params.id);
  invariant(typeof id === "number", "expected params.id");

  const pagination = getPagination(request);

  const client = await getDiscogsClient(request);

  const [label, releases] = await Promise.all([
    client.getLabel(id),
    client.getLabelReleases(id, pagination),
  ]);

  return {
    label: {
      id,
      name: label.name,
      src: primaryOrFirstImage(label.images)?.uri,
    },
    releases: {
      pagination: {
        items: releases.pagination.items,
        page: releases.pagination.page,
        perPage: releases.pagination.per_page,
      },
      releases: releases.releases.map(
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
