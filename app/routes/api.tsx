import { Outlet } from 'remix';
import { ClientOnly } from 'remix-utils';
import BottomBar from '~/components/BottomBar';
import Sidebar from '~/components/Sidebar';

export default function Route() {
  return (
    <div className="bg-neutral-50 flex flex-col h-screen text-neutral-900">
      <div className="flex-1 flex overflow-y-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Outlet />
        </div>
      </div>
      <ClientOnly>
        <BottomBar />
      </ClientOnly>
    </div>
  );
}
