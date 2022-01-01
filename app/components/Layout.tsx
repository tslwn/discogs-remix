import { Form, useTransition } from 'remix';

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  const transition = useTransition();

  return (
    <div className="">
      <header className="bg-white border-t border-gray-200 bottom-0 fixed w-full">
        <nav className="max-w-xl mx-auto">
          <Form
            className="flex justify-center p-2 w-full"
            method="post"
            action="/signout"
          >
            <button
              aria-label="Sign out"
              className="hover:underline"
              disabled={transition.state === 'submitting'}
              title="Sign out"
              type="submit"
            >
              Sign out
            </button>
          </Form>
        </nav>
      </header>
      <main className="max-w-xl mx-auto">{children}</main>
    </div>
  );
}
