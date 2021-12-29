import { createCookieSessionStorage } from 'remix';

const { commitSession, destroySession, getSession } =
  createCookieSessionStorage({
    cookie: {
      name: '__session',
    },
  });

export { commitSession, destroySession, getSession };
