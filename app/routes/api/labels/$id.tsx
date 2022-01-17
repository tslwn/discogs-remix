import { PhotographIcon } from "@heroicons/react/solid";
import { useLoaderData } from "remix";
import ImageListItem from "~/components/common/ImageListItem";
import Page from "~/components/common/Page";
import PageControls from "~/components/common/PageControls";
import type { LoaderData } from "~/loaders/label.server";
import { getResourceUrl } from "~/util/release";

export { loader } from "~/loaders/label.server";

export default function Route() {
  const { label, releases } = useLoaderData<LoaderData>();

  return (
    <Page>
      <div className="flex mb-8">
        <div className="mr-4 overflow-hidden rounded">
          {label.src !== undefined ? (
            <img alt={label.name} className="h-56" src={label.src}></img>
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
            items={releases.pagination.items}
            pagination={{
              page: releases.pagination.page,
              perPage: releases.pagination.perPage,
            }}
            url={`/api/labels/${label.id}`}
          />
        </div>
        <ul>
          {releases.releases.map((release) => {
            const text = release.artist + " - " + release.title;

            return (
              <li className="mb-4" key={release.id}>
                <ImageListItem
                  imageProps={{
                    alt: text,
                    src: release.thumb,
                  }}
                  linkProps={{
                    children: text,
                    to: getResourceUrl(release),
                    visited: true,
                  }}
                  subtitle={
                    release.year !== 0 ? release.year.toString() : "Unknown"
                  }
                />
              </li>
            );
          })}
        </ul>
      </div>
    </Page>
  );
}
