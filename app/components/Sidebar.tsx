import Link from '~/components/Link';

export default function Sidebar() {
  return (
    <div className="bg-neutral-100 flex flex-col flex-none justify-between sidebar w-52">
      <div className="px-4 py-6">
        <ul>
          <li>
            <Link to="/api">Home</Link>
          </li>
        </ul>
      </div>
      <div className="flex group h-16 items-center p-4">
        <Link to="/signout">Sign out</Link>
      </div>
    </div>
  );
}
