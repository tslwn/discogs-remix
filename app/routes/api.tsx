import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { Outlet, useLoaderData, useMatches } from "remix";
import { ClientOnly } from "remix-utils";
import invariant from "tiny-invariant";
import QueuePlayer from "~/components/QueuePlayer";
import Link from "~/components/common/Link";
import NavLink from "~/components/common/NavLink";
import type { LoaderData } from "~/types/loaders";
import { getDiscogsClient } from "~/util/auth.server";

export const loader = async ({ request }: DataFunctionArgs) => {
  const client = await getDiscogsClient(request);

  const { username } = await client.getIdentity();
  const { curr_abbr } = await client.getProfile(username);
  const { lists } = await client.getUserLists(username);

  return { curr_abbr, lists, username };
};

export function useRouteData() {
  const matches = useMatches();

  const match = matches.find((match) => match.pathname === "/api");
  invariant(match !== undefined, "expected /api match");

  return match.data as LoaderData<typeof loader>;
}

export default function Route() {
  const { lists, username } = useLoaderData<LoaderData<typeof loader>>();

  return (
    <div className="bg-neutral-50 flex flex-col h-screen text-neutral-900">
      <div className="flex-1 flex overflow-y-hidden">
        <div className="bg-neutral-100 flex flex-col flex-none justify-between sidebar w-52">
          <div className="px-4 py-6">
            <div className="mb-8">
              <Link className="font-semibold" to="/api">
                Home
              </Link>
            </div>
            <div className="font-semibold mb-8">
              <NavLink to={`/api/users/${username}/wants`}>Wantlist</NavLink>
            </div>
            <div className="mb-8">
              <div className="font-semibold mb-4">
                <span>Lists</span>
              </div>
              <ul className="text-sm">
                {lists.map((list) => (
                  <li
                    className="overflow-hidden text-ellipsis whitespace-nowrap"
                    key={list.id}
                  >
                    <NavLink to={`/api/lists/${list.id}`}>{list.name}</NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex group h-16 items-center p-4">
            <Link to="/signout">Sign out</Link>
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <Outlet />
        </div>
      </div>
      <ClientOnly>
        <QueuePlayer />
      </ClientOnly>
    </div>
  );
}
