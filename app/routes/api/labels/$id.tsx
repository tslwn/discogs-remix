import { PhotographIcon } from "@heroicons/react/solid";
import { LoaderFunction, useLoaderData } from "remix";
import invariant from "tiny-invariant";
import ItemCard from "~/components/ItemCard";
import Page from "~/components/Page";
import { byYear, primaryOrFirstImage } from "~/lib/release";
import type { Label, LabelReleases } from "~/types/discojs";
import { getDiscogsClient } from "~/util/auth.server";

export const loader: LoaderFunction = async ({ params, request }) => {
  const id = Number(params.id);
  invariant(typeof id === "number", "expected params.id");

  const client = await getDiscogsClient(request);

  const label = await client.getLabel(id);
  const labelReleases = await client.getLabelReleases(id);
  labelReleases.releases.sort(byYear);

  return {
    label,
    labelReleases,
  };
};

interface LoaderData {
  label: Label;
  labelReleases: LabelReleases;
}

export default function Route() {
  const { label, labelReleases } = useLoaderData<LoaderData>();

  const src = primaryOrFirstImage(label.images)?.uri;

  return (
    <Page>
      <div className="flex mb-8">
        <div className="mr-4 overflow-hidden rounded">
          {src !== undefined ? (
            <img alt={label.name} className="h-56" src={src}></img>
          ) : (
            <div className="bg-neutral-200 flex h-56 items-center justify-center w-56">
              <PhotographIcon className="text-neutral-500 h-5 w-5" />
            </div>
          )}
        </div>
        <h2 className="font-semibold text-3xl">{label.name}</h2>
      </div>
      <div>
        <h4 className="mb-4 text-lg">Releases</h4>
        <ul>
          {labelReleases.releases.map((release) => {
            const text = `${release.artist} - ${release.title}`;

            const to =
              release.type === "master"
                ? `/api/masters/${release.id}`
                : `/api/releases/${release.id}`;

            return (
              <li className="mb-4" key={release.id}>
                <ItemCard
                  title={{ text, to }}
                  subtitle={release.year !== 0 ? release.year.toString() : ""}
                  image={{
                    alt: text,
                    src: release.thumb,
                  }}
                  visited
                />
              </li>
            );
          })}
        </ul>
      </div>
    </Page>
  );
}
