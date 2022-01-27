import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { useLoaderData } from "remix";
import invariant from "tiny-invariant";
import ImageListItem from "~/components/common/ImageListItem";
import Page from "~/components/common/Page";
import PageControls from "~/components/common/PageControls";
import type { LoaderData } from "~/types/loaders";
import { getDiscogsClient } from "~/util/auth.server";
import { SearchType } from "~/util/discogs";
import { getPagination } from "~/util/pagination";
import { formatReleaseArtists, getResourceUrl } from "~/util/release";

export const loader = async ({ params, request }: DataFunctionArgs) => {
  const username = params.username;
  invariant(typeof username === "string", "expected params.username");

  const client = await getDiscogsClient(request);
  const { pagination, wants } = await client.getUserWants(
    username,
    getPagination(request)
  );

  return { pagination, username, wants };
};

export const meta = ({ data }: { data: LoaderData<typeof loader> }) => ({
  title: data.username + " / Wantlist",
});

export default function Route() {
  const { pagination, username, wants } =
    useLoaderData<LoaderData<typeof loader>>();

  return (
    <Page>
      <div className="flex mb-4">
        <h2 className="font-semibold text-3xl">Wantlist</h2>
      </div>
      <div className="mb-4">
        <PageControls
          items={pagination.items}
          pagination={{
            page: pagination.page,
            perPage: pagination.per_page,
          }}
          url={`/api/users/${username}/wants`}
        />
      </div>
      <ul>
        {wants.map((want) => {
          return (
            <li className="mb-2" key={want.id}>
              <ImageListItem
                imageProps={{
                  alt: want.basic_information.title,
                  src: want.basic_information.thumb,
                }}
                linkProps={{
                  children: want.basic_information.title,
                  to: getResourceUrl({ id: want.id, type: SearchType.RELEASE }),
                  visited: true,
                }}
                subtitle={formatReleaseArtists(want.basic_information.artists)}
              />
            </li>
          );
        })}
      </ul>
    </Page>
  );
}
