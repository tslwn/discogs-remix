export function envVar(key: string) {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is undefined`);
  }
  return value;
}

export function discogsEnv() {
  return {
    consumerKey: envVar('DISCOGS_CONSUMER_KEY'),
    consumerSecret: envVar('DISCOGS_CONSUMER_SECRET'),
    userAgent: envVar('DISCOGS_USER_AGENT'),
  };
}
