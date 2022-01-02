import { Form, Link, redirect } from 'remix';
import type { ActionFunction } from 'remix';
import { destroySession, getSession } from '~/lib/sessions.server';

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  return redirect('/auth', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
};

export default function SignoutRoute() {
  return (
    <div className="text-center">
      <p>Are you sure you want to sign out?</p>
      <Form method="post">
        <button className="hover:underline">Sign out</button>
      </Form>
      <Link className="hover:underline" to="/api">
        Nope
      </Link>
    </div>
  );
}