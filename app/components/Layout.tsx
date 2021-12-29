import type { PropsWithChildren } from 'react';
import { Form, Link, useTransition } from 'remix';
import { HomeIcon, LogoutIcon, UserIcon } from '@heroicons/react/solid';

export default function AuthenticatedLayout({
  children,
}: PropsWithChildren<{}>): JSX.Element {
  const transition = useTransition();

  return (
    <div className="flex min-h-screen max-w-xl mx-auto">
      <header>
        <nav className="p-4 shrink">
          <ul>
            <li className="mb-2">
              <Link
                aria-label="Home"
                className="flex hover:bg-gray-200 items-center p-3 rounded-full"
                title="Home"
                to="/"
              >
                <HomeIcon className="h-5 w-5" />
              </Link>
            </li>
            <li className="mb-2">
              <Link
                aria-label="Profile"
                className="flex hover:bg-gray-200 items-center p-3 rounded-full"
                title="Profile"
                to="/profile"
              >
                <UserIcon className="h-5 w-5" />
              </Link>
            </li>
            <li>
              <Form method="post" action="/signout">
                <button
                  aria-label="Sign out"
                  className="flex hover:bg-gray-200  items-center p-3 rounded-full"
                  disabled={transition.state === 'submitting'}
                  title="Sign out"
                  type="submit"
                >
                  <LogoutIcon className="h-5 w-5" />
                </button>
              </Form>
            </li>
          </ul>
        </nav>
      </header>
      <main className="border-x border-gray-200 grow">{children}</main>
    </div>
  );
}
