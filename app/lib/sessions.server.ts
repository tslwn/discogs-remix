import { createCookieSessionStorage } from 'remix';
import type { Session } from 'remix';

const { commitSession, destroySession, getSession } =
  createCookieSessionStorage({
    cookie: {
      name: '__session',
      secrets: [],
    },
  });

export { commitSession, destroySession, getSession };

export function sessionGetOrError(session: Session, key: string) {
  const value = session.get(key);
  if (typeof value !== 'string') {
    throw new Error(`No value ${key} in session cookie`);
  }
  return value;
}
