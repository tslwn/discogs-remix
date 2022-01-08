import { Form, redirect } from 'remix';
import type { ActionFunction } from 'remix';
import Button from '~/components/Button';
import Link from '~/components/Link';
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
      <h2 className="mb-8">Are you sure you want to sign out?</h2>
      <Form className="mb-4" method="post">
        <Button>Sign out</Button>
      </Form>
      <Link to="/api">Nope</Link>
    </div>
  );
}
