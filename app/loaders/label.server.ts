import type { LoaderFunction } from "remix";
import invariant from "tiny-invariant";
import type { Label, LabelReleases } from "~/types/discojs";
import { getDiscogsClient } from "~/util/auth.server";
import { getPagination } from "~/util/pagination";

// anti-colocation but fixes esbuild import problems

export const loader: LoaderFunction = async ({ params, request }) => {
  const id = Number(params.id);
  invariant(typeof id === "number", "expected params.id");

  const pagination = getPagination(request);

  const client = await getDiscogsClient(request);

  return {
    label: await client.getLabel(id),
    labelReleases: await client.getLabelReleases(id, pagination),
  };
};

export interface LoaderData {
  label: Label;
  labelReleases: LabelReleases;
}
