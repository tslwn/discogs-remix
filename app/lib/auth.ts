import type { Session } from 'remix';
import { discogsEnv } from './env';
import { sessionGetOrError } from './sessions';

function requestTokenAuthorizationHeader(
  consumerKey: string,
  consumerSecret: string
) {
  const header = `OAuth oauth_consumer_key="${consumerKey}",oauth_nonce="${Date.now()}",oauth_signature="${consumerSecret}&",oauth_signature_method="PLAINTEXT",oauth_timestamp="${Date.now()}",oauth_callback="${
    process.env.URL
  }/callback"`;
  return header;
}

const REQUEST_TOKEN_RESPONSE_REGEX =
  /oauth_token=(\w+)&oauth_token_secret=(\w+)&oauth_callback_confirmed=(true|false)/;

export async function fetchRequestToken() {
  const { consumerKey, consumerSecret, userAgent } = discogsEnv();

  const response = await fetch('https://api.discogs.com/oauth/request_token', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: requestTokenAuthorizationHeader(
        consumerKey,
        consumerSecret
      ),
      'User-Agent': userAgent,
    },
  });

  const text = await response.text();

  const matches = text.match(REQUEST_TOKEN_RESPONSE_REGEX);

  if (matches === null) {
    throw new Error('No OAuth request token or secret in response');
  }

  const [, token, tokenSecret] = matches;

  return {
    token,
    tokenSecret,
  };
}

export function authorizeUrl(requestToken: string) {
  return `https://discogs.com/oauth/authorize?oauth_token=${requestToken}`;
}

function accessTokenAuthorizationHeader(
  consumerKey: string,
  consumerSecret: string,
  requestToken: string,
  requestTokenSecret: string,
  verifier: string
) {
  const header = `OAuth oauth_consumer_key="${consumerKey}",oauth_nonce="${Date.now()}",oauth_token="${requestToken}",oauth_signature="${consumerSecret}&${requestTokenSecret}",oauth_signature_method="PLAINTEXT",oauth_timestamp="${Date.now()}",oauth_verifier="${verifier}"`;
  return header;
}

const ACCESS_TOKEN_RESPONSE_REGEX =
  /oauth_token=(\w+)&oauth_token_secret=(\w+)/;

function urlSearchParam(url: URL, key: string) {
  const value = url.searchParams.get(key);
  if (value === null) {
    throw new Error(`No search param ${key} in URL ${url.toString()}`);
  }
  return value;
}

function requestTokenSearchParams(url: URL) {
  return {
    requestToken: urlSearchParam(url, 'oauth_token'),
    verifier: urlSearchParam(url, 'oauth_verifier'),
  };
}

export async function fetchAccessToken(session: Session, url: string) {
  const { consumerKey, consumerSecret, userAgent } = discogsEnv();

  const { requestToken, verifier } = requestTokenSearchParams(new URL(url));

  const requestTokenSecret = sessionGetOrError(
    session,
    'oauth_request_token_secret'
  );

  const response = await fetch('https://api.discogs.com/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: accessTokenAuthorizationHeader(
        consumerKey,
        consumerSecret,
        requestToken,
        requestTokenSecret,
        verifier
      ),
      'User-Agent': userAgent,
    },
  });

  const text = await response.text();

  const matches = text.match(ACCESS_TOKEN_RESPONSE_REGEX);

  if (matches === null) {
    throw new Error('No OAuth access token or secret in response');
  }

  const [, token, tokenSecret] = matches;

  return {
    token,
    tokenSecret,
  };
}

function authorizationHeader(
  consumerKey: string,
  consumerSecret: string,
  accessToken: string,
  accessTokenSecret: string
) {
  const header = `OAuth oauth_consumer_key="${consumerKey}",oauth_nonce="${Date.now()}",oauth_token="${accessToken}",oauth_signature="${consumerSecret}&${accessTokenSecret}",oauth_signature_method="PLAINTEXT",oauth_timestamp="${Date.now()}"`;
  return header;
}

export const DISCOGS_API_URL = 'https://api.discogs.com';

export function fetchFactory(session: Session) {
  const { consumerKey, consumerSecret } = discogsEnv();

  const accessToken = sessionGetOrError(session, 'oauth_access_token');

  const accessTokenSecret = sessionGetOrError(
    session,
    'oauth_access_token_secret'
  );

  return async function (input: RequestInfo, init?: RequestInit) {
    return fetch(
      typeof input === 'string' ? `${DISCOGS_API_URL}/${input}` : input,
      {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: authorizationHeader(
            consumerKey,
            consumerSecret,
            accessToken,
            accessTokenSecret
          ),
        },
      }
    );
  };
}

export function isAuthenticated(session: Session) {
  return (
    session.has('oauth_access_token') &&
    session.has('oauth_access_token_secret')
  );
}
