import { PhotographIcon } from "@heroicons/react/solid";
import { useLoaderData } from "remix";
import ItemCard from "~/components/ItemCard";
import Collapsible from "~/components/common/Collapsible";
import Link from "~/components/common/Link";
import Page from "~/components/common/Page";
import PageControls from "~/components/common/PageControls";
import type { LoaderData } from "~/loaders/artist.server";

export { loader } from "~/loaders/artist.server";

export default function Route() {
  const { id, name, src, members, releases } = useLoaderData<LoaderData>();

  return (
    <Page>
      <div className="flex mb-8">
        <div className="mr-4 overflow-hidden rounded">
          {src !== undefined ? (
            <img alt={name} className="h-56" src={src}></img>
          ) : (
            <div className="bg-neutral-200 flex h-56 items-center justify-center">
              <PhotographIcon className="text-neutral-500 h-5 w-5" />
            </div>
          )}
        </div>
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

                const to =
                  release.type === "master"
                    ? `/api/masters/${release.id}`
                    : `/api/releases/${release.id}`;

                return (
                  <li className="mb-4" key={release.id}>
                    <ItemCard
                      title={{ text, to }}
                      subtitle={release.year?.toString()}
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
