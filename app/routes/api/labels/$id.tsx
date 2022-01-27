import { useLoaderData } from "remix";
import Image from "~/components/common/Image";
import ImageListItem from "~/components/common/ImageListItem";
import Page from "~/components/common/Page";
import PageControls from "~/components/common/PageControls";
import type { LoaderData } from "~/loaders/label.server";
import { getResourceUrl } from "~/util/release";

export { loader } from "~/loaders/label.server";

export const meta = ({ data }: { data: LoaderData }) => ({
  title: data.label.name,
});

export default function Route() {
  const { label, releases } = useLoaderData<LoaderData>();

  return (
    <Page>
      <div className="flex mb-8">
        <Image
          alt={label.name}
          className="mr-4"
          size={56}
          square={false}
          src={label.src}
        />
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
