import { redirect } from 'remix';
import type { LoaderFunction } from 'remix';
import { fetchAccessToken } from '~/lib/auth.server';
import { clientFactory } from '~/lib/client.server';
import { commitSession, getSession } from '~/lib/sessions.server';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  try {
    const { token, tokenSecret } = await fetchAccessToken(session, request.url);

    session.set('oauth_access_token', token);
    session.set('oauth_access_token_secret', tokenSecret);

    const client = clientFactory(session);

    const profile = await client.getProfile();

    session.set('username', profile.username);
    session.set('curr_abbr', profile.curr_abbr);

    return redirect('/api', {
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
