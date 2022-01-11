import { PhotographIcon } from "@heroicons/react/solid";
import { useLoaderData } from "remix";
import ItemCard from "~/components/ItemCard";
import Page from "~/components/Page";
import PageControls from "~/components/PageControls";
import type { LoaderData } from "~/loaders/label.server";
import { primaryOrFirstImage } from "~/util/release";

export { loader } from "~/loaders/label.server";

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
        <div className="mb-4">
          <PageControls
            items={labelReleases.pagination.items}
            pagination={{
              page: labelReleases.pagination.page,
              perPage: labelReleases.pagination.per_page,
            }}
            url={`/api/labels/${label.id}`}
          />
        </div>
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
