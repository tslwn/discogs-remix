import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { useLoaderData } from "remix";
import invariant from "tiny-invariant";
import Image from "~/components/common/Image";
import Page from "~/components/common/Page";
import Stat from "~/components/common/Stat";
import type { LoaderData } from "~/types/loaders";
import { getDiscogsClient } from "~/util/auth.server";

export const loader = async ({ params, request }: DataFunctionArgs) => {
  const username = params.username;
  invariant(typeof username === "string", "expected params.username");

  const client = await getDiscogsClient(request);
  const profile = await client.getProfile(username);

  return profile;
};

export const meta = ({ data }: { data: LoaderData<typeof loader> }) => ({
  title: data.username,
});

export default function Route() {
  const profile = useLoaderData<LoaderData<typeof loader>>();

  return (
    <Page>
      <div className="flex mb-8">
        <Image
          alt={profile.username}
          className="mr-4"
          size={56}
          square={false}
          src={profile.avatar_url}
        />
        <div className="flex flex-col">
          <div className="mb-4">
            <h2 className="font-semibold text-3xl">{profile.username}</h2>
          </div>
        </div>
      </div>
      <div className="flex items-center mb-4 space-x-8">
        <Stat
          className="border-green-600"
          text="in collection"
          value={profile.num_collection}
        />
        <Stat
          className="border-red-600"
          text="in wantlist"
          value={profile.num_wantlist}
        />
      </div>
    </Page>
  );
}
