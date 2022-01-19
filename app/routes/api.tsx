import { Outlet, useLoaderData } from "remix";
import { ClientOnly } from "remix-utils";
import QueuePlayer from "~/components/QueuePlayer";
import Link from "~/components/common/Link";
import NavLink from "~/components/common/NavLink";
import type { Lists } from "~/loaders/lists.server";

export { lists as loader } from "~/loaders/lists.server";

export default function Route() {
  const { lists } = useLoaderData<Lists>();

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
            <div className="mb-8">
              <div className="font-semibold mb-4">
                <span>Lists</span>
              </div>
              <ul className="text-sm">
                {lists.map((list) => (
                  <li className="overflow-hidden text-ellipsis whitespace-nowrap">
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
