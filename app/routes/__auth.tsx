import { Outlet } from 'remix';

export default function Layout() {
  return (
    <main className="max-w-sm mx-auto my-12">
      <Outlet />
    </main>
  );
}
