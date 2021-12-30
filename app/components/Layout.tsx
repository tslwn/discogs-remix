import { Form, Link, useTransition } from 'remix';

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  const transition = useTransition();

  return (
    <div className="flex min-h-screen max-w-xl mx-auto">
      <header>
        <nav className="p-4 shrink">
          <ul>
            <li className="mb-2 text-right">
              <Link
                aria-label="Home"
                className="hover:text-gray-400 underline"
                title="Home"
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="text-right">
              <Form method="post" action="/signout">
                <button
                  aria-label="Sign out"
                  className="hover:text-gray-400 underline"
                  disabled={transition.state === 'submitting'}
                  title="Sign out"
                  type="submit"
                >
                  Sign out
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
