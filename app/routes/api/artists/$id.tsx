import { useLoaderData } from "remix";
import Collapsible from "~/components/common/Collapsible";
import Image from "~/components/common/Image";
import ImageListItem from "~/components/common/ImageListItem";
import Link from "~/components/common/Link";
import Page from "~/components/common/Page";
import PageControls from "~/components/common/PageControls";
import { LoaderData } from "~/loaders/artist.server";
import { getResourceUrl } from "~/util/release";

export { loader } from "~/loaders/artist.server";

export const meta = ({ data }: { data: LoaderData }) => ({ title: data.name });

export default function Route() {
  const { id, name, src, members, releases } = useLoaderData<LoaderData>();

  return (
    <Page>
      <div className="flex mb-8">
        <Image alt={name} className="mr-4" size={56} square={false} src={src} />
        <div className="w-full">
          <h2 className="font-semibold mb-4 text-3xl">{name}</h2>
          {members !== undefined && members.length > 0 ? (
            <Collapsible
              heading="Members"
              panel={
                <div>
                  {members?.map((member, index) => (
                    <>
                      <Link to={`/api/artists/${member.id}`} visited>
                        {member.name}
                      </Link>
                      {index < members.length - 1 ? <span>, </span> : null}
                    </>
                  ))}
                </div>
              }
            />
          ) : null}
        </div>
      </div>
      <div>
        <div className="mb-4">
          <PageControls
            items={releases.pagination.items}
            pagination={{
              page: releases.pagination.page,
              perPage: releases.pagination.perPage,
            }}
            url={`/api/artists/${id}`}
          />
        </div>
        {releases.releases.map(({ role, releases }) => (
          <div className="mb-8">
            <h4 className="bg-neutral-200 font-semibold mb-4 px-4 py-2 rounded-lg w-full">
              {role}
            </h4>
            <ul>
              {releases.map((release) => {
                const text =
                  release.artist !== name
                    ? `${release.artist} - ${release.title}`
                    : release.title;

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
                      subtitle={release.year?.toString()}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <PageControls
          items={releases.pagination.items}
          pagination={{
            page: releases.pagination.page,
            perPage: releases.pagination.perPage,
          }}
          url={`/api/artists/${id}`}
        />
      </div>
    </Page>
  );
}
