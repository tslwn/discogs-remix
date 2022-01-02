import { Discojs } from 'discojs';
import type { Session } from 'remix';
import { discogsEnv } from '~/lib/env.server';
import { getSession, sessionGetOrError } from '~/lib/sessions.server';

export function clientFactory(session: Session) {
  const { consumerKey, consumerSecret, userAgent } = discogsEnv();

  return new Discojs({
    consumerKey,
    consumerSecret,
    oAuthToken: sessionGetOrError(session, 'oauth_access_token'),
    oAuthTokenSecret: sessionGetOrError(session, 'oauth_access_token_secret'),
    userAgent,
  });
}

export async function getSessionAndClient(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));

  const client = clientFactory(session);

  return { client, session };
}
