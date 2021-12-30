import { Form, Link, useTransition } from 'remix';

function randomIntegerFactory(max: number) {
  return function () {
    return Math.floor(Math.random() * max);
  };
}

// "The Discogs database contains more than 14 million releases"
// https://blog.discogs.com/en/record-collection-500-million-releases-cataloged-on-discogs/
const randomReleaseId = randomIntegerFactory(14_000_000);

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  const transition = useTransition();

  return (
    <div className="max-w-xl mx-auto">
      <header className="bg-white border-t border-gray-200 bottom-0 fixed w-full">
        <nav className="max-w-xl mx-auto p-2">
          <ul className="flex justify-center w-full">
            <li className="mr-2">
              <Link
                aria-label="Home"
                className="hover:text-gray-400 underline"
                title="Home"
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="mr-2">
              <Link
                aria-label="Random"
                className="hover:text-gray-400 underline"
                title="Random"
                to={`/releases/${randomReleaseId()}`}
              >
                Random
              </Link>
            </li>
            <li className="">
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
      <main className="">{children}</main>
    </div>
  );
}
