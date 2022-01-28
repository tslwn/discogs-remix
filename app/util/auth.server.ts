// https://github.com/ryanflorence/remix-planner/blob/main/app/util/auth.server.tsx
import { createCookieSessionStorage, json, redirect } from "remix";
import type { ActionFunction, LoaderFunction, Session } from "remix";
import { createOrUpdateUser } from "~/models/user";
import DiscogsClient from "~/util/discogs";

// prevent start-up if any environment variable is undefined
if (typeof process.env.DISCOGS_CONSUMER_KEY !== "string")
  throw new Error("process.env.DISCOGS_CONSUMER_KEY is undefined");
if (typeof process.env.DISCOGS_CONSUMER_SECRET !== "string")
  throw new Error("process.env.DISCOGS_CONSUMER_SECRET is undefined");
if (typeof process.env.DISCOGS_USER_AGENT !== "string")
  throw new Error("process.env.DISCOGS_USER_AGENT is undefined");
if (typeof process.env.SESSION_SECRET !== "string")
  throw new Error("process.env.SESSION_SECRET is undefined");
if (typeof process.env.URL !== "string")
  throw new Error("process.env.URL is undefined");
if (typeof process.env.YOUTUBE_API_KEY !== "string")
  throw new Error("process.env.YOUTUBE_API_KEY is undefined");

// create user session
const authSession = createCookieSessionStorage({
  cookie: {
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
  },
});

export async function requireAuthSession(request: Request): Promise<Session> {
  const session = await getAuthSession(request);
  if (session === null) {
    throw redirect("/signin", {
      status: 303,
      headers: {
        "auth-redirect": getReferrer(request),
      },
    });
  }
  return session;
}

export async function getAuthSession(
  request: Request
): Promise<Session | null> {
  const cookie = request.headers.get("Cookie");
  const session = await authSession.getSession(cookie);

  return session.has("oauth_access_token") &&
    session.has("oauth_access_token_secret")
    ? session
    : null;
}

export const signinLoader: LoaderFunction = async ({ request }) => {
  const username = await getSessionUsername(request);
  if (username !== null) {
    return redirect("/");
  }
  return json({ landingPage: getReferrer(request) });
};

export const signinAction: ActionFunction = async ({ request }) => {
  const cookie = request.headers.get("Cookie");
  const session = await authSession.getSession(cookie);

  const { token, secret } = await fetchRequestToken();
  session.set("oauth_request_token", token);
  session.set("oauth_request_token_secret", secret);

  return redirect(`https://discogs.com/oauth/authorize?oauth_token=${token}`, {
    headers: { "Set-Cookie": await authSession.commitSession(session) },
  });
};

export const callbackLoader: LoaderFunction = async ({ request }) => {
  const cookie = request.headers.get("Cookie");
  const session = await authSession.getSession(cookie);

  const { token, secret } = await fetchAccessToken(session, request.url);
  session.set("oauth_access_token", token);
  session.set("oauth_access_token_secret", secret);
  session.unset("oauth_request_token");
  session.unset("oauth_request_token_secret");

  const client = new DiscogsClient({
    consumerKey: process.env.DISCOGS_CONSUMER_KEY!,
    consumerSecret: process.env.DISCOGS_CONSUMER_SECRET!,
    oAuthToken: token,
    oAuthTokenSecret: secret,
    userAgent: process.env.DISCOGS_USER_AGENT!,
  });
  const { username } = await client.getIdentity();

  await createOrUpdateUser(username);

  return redirect("/api", {
    headers: { "Set-Cookie": await authSession.commitSession(session) },
  });
};

export const signoutAction: ActionFunction = async () => {
  const session = await authSession.getSession();
  return redirect("/", {
    headers: {
      "Set-Cookie": await authSession.destroySession(session),
    },
  });
};

function getReferrer(request: Request): string {
  const referrer = request.referrer;
  if (referrer) {
    const url = new URL(referrer);
    return url.pathname + url.search;
  }
  return "/";
}

export async function requireUsername(request: Request): Promise<string> {
  const username = await getSessionUsername(request);
  if (username === null) {
    throw redirect("/signin");
  }
  return username;
}

export async function getSessionUsername(
  request: Request
): Promise<string | null> {
  const session = await getAuthSession(request);
  return session?.get("username") || null;
}

// Discogs "OAuth"

export async function fetchRequestToken(): Promise<{
  token: string;
  secret: string;
}> {
  const response = await fetch("https://api.discogs.com/oauth/request_token", {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `OAuth oauth_consumer_key="${
        process.env.DISCOGS_CONSUMER_KEY
      }",oauth_nonce="${Date.now()}",oauth_signature="${
        process.env.DISCOGS_CONSUMER_SECRET
      }&",oauth_signature_method="PLAINTEXT",oauth_timestamp="${Date.now()}",oauth_callback="${
        process.env.URL
      }/callback"`,
      // non-null assertion is OK, see above
      "User-Agent": process.env.DISCOGS_USER_AGENT!,
    },
  });
  const text = await response.text();

  const matches = text.match(
    /oauth_token=(\w+)&oauth_token_secret=(\w+)&oauth_callback_confirmed=(true|false)/
  );

  const token = matches?.[1];
  if (typeof token !== "string") throw new Error("expected oauth_token");
  const secret = matches?.[2];
  if (typeof secret !== "string")
    throw new Error("expected oauth_token_secret");

  return {
    token,
    secret,
  };
}

export function authorizeUrl(token: string): string {
  return `https://discogs.com/oauth/authorize?oauth_token=${token}`;
}

export async function fetchAccessToken(session: Session, url: string) {
  const requestToken = new URL(url).searchParams.get("oauth_token");
  if (typeof requestToken !== "string") throw new Error("expected oauth_token");
  const requestSecret = session.get("oauth_request_token_secret");
  if (typeof requestSecret !== "string")
    throw new Error("expected oauth_request_token_secret");
  const verifier = new URL(url).searchParams.get("oauth_verifier");
  if (typeof verifier !== "string") throw new Error("expected oauth_verifier");

  const response = await fetch("https://api.discogs.com/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `OAuth oauth_consumer_key="${
        process.env.DISCOGS_CONSUMER_KEY
      }",oauth_nonce="${Date.now()}",oauth_token="${requestToken}",oauth_signature="${
        process.env.DISCOGS_CONSUMER_SECRET
      }&${requestSecret}",oauth_signature_method="PLAINTEXT",oauth_timestamp="${Date.now()}",oauth_verifier="${verifier}"`,
      "User-Agent": process.env.DISCOGS_USER_AGENT!,
    },
  });

  const text = await response.text();

  const matches = text.match(/oauth_token=(\w+)&oauth_token_secret=(\w+)/);

  const token = matches?.[1];
  if (typeof token !== "string") throw new Error("expected oauth_token");
  const secret = matches?.[2];
  if (typeof secret !== "string")
    throw new Error("expected oauth_token_secret");

  return {
    token,
    secret,
  };
}

export async function getDiscogsClient(request: Request) {
  const session = await getAuthSession(request);

  return new DiscogsClient({
    consumerKey: process.env.DISCOGS_CONSUMER_KEY!,
    consumerSecret: process.env.DISCOGS_CONSUMER_SECRET!,
    oAuthToken: session?.get("oauth_access_token"),
    oAuthTokenSecret: session?.get("oauth_access_token_secret"),
    userAgent: process.env.DISCOGS_USER_AGENT!,
  });
}
