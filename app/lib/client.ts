import { Discojs } from 'discojs';
import { Session } from 'remix';
import { discogsEnv } from './env';
import { sessionGetOrError } from './sessions';

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
