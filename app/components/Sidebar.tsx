import Link from '~/components/Link';

export default function Sidebar() {
  return (
    <div className="border-r flex flex-col flex-none justify-between sidebar w-52">
      <div className="p-4">
        <ul>
          <li>
            <Link to="/api">Home</Link>
          </li>
        </ul>
      </div>
      <div className="border-t flex group h-16 items-center p-4">
        <Link to="/signout">Sign out</Link>
      </div>
    </div>
  );
}
