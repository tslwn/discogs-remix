import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { useLoaderData } from "remix";
import Link from "~/components/common/Link";
import type { LoaderData } from "~/types/loaders";
import { getDiscogsClient } from "~/util/auth.server";

export const loader = async ({ request }: DataFunctionArgs) => {
  const client = await getDiscogsClient(request);

  return client.getIdentity();
};

export default function Route() {
  const data = useLoaderData<LoaderData<typeof loader>>();

  return (
    <div className="p-4">
      <p className="mb-2">You are signed in as {data.username}.</p>
      <p className="mb-2">Try these links:</p>
      <ul className="list-disc ml-4">
        <li>
          <Link to={`/api/labels/3193`}>Threshold House</Link> (label)
        </li>
        <li>
          <Link to={`/api/artists/660`}>Coil</Link> (artist)
        </li>
        <li>
          <Link to={`/api/masters/5656`}>Musick To Play In The Dark</Link>{" "}
          (master)
        </li>
        <li>
          <Link to={`/api/releases/56898`}>Musick To Play In The Dark²</Link>{" "}
          (version)
        </li>
      </ul>
    </div>
  );
}
