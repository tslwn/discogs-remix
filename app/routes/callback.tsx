import { redirect } from 'remix';
import type { LoaderFunction } from 'remix';
import { fetchAccessToken } from '~/lib/auth';
import { commitSession, getSession } from '~/lib/sessions';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  try {
    const { token, tokenSecret } = await fetchAccessToken(session, request.url);

    session.set('oauth_access_token', token);
    session.set('oauth_access_token_secret', tokenSecret);

    return redirect('/', {
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
