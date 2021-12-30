import { Form, json, redirect, useLoaderData } from 'remix';
import type { ActionFunction, LoaderFunction } from 'remix';
import Button from '~/components/Button';
import {
  authorizeUrl,
  fetchRequestToken,
  isAuthenticated,
} from '~/lib/auth.server';
import { commitSession, getSession } from '~/lib/sessions.server';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  if (isAuthenticated(session)) {
    return redirect('/');
  }

  return json(
    { error: session.get('error') },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  );
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  try {
    const { token, tokenSecret } = await fetchRequestToken();

    session.set('oauth_request_token', token);
    session.set('oauth_request_token_secret', tokenSecret);

    return redirect(authorizeUrl(token), {
      headers: { 'Set-Cookie': await commitSession(session) },
    });
  } catch (error) {
    session.flash('error', (error as Error).message);

    return redirect('/auth', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }
};

export default function Auth() {
  const data = useLoaderData<{ error?: string }>();

  return (
    <Form className="flex flex-col items-center w-full" method="post">
      <div className="mb-4 text-center">
        <Button>Sign in</Button>
      </div>
      <p className="text-red-700 text-xs">{data.error}</p>
    </Form>
  );
}
