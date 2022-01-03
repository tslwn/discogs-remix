import Link from '~/components/Link';

export default function Sidebar() {
  return (
    <div className="border-r flex flex-col flex-none justify-between sidebar w-48">
      <ul className="p-4">
        <li>
          <Link to="/api">Home</Link>
        </li>
      </ul>
      <div className="border-t flex group h-16 items-center p-4">
        <Link to="/signout">Sign out</Link>
      </div>
    </div>
  );
}
