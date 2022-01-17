// adapted from https://github.com/aknorw/discojs

const API_BASE_URL = "https://api.discogs.com";

const API_VERSION = "v2";

interface DiscogsClientOptions {
  consumerKey: string;
  consumerSecret: string;
  oAuthToken: string;
  oAuthTokenSecret: string;
  userAgent: string;
}

const OUTPUT_FORMAT = "discogs";

export default class DiscogsClient {
  constructor(options: DiscogsClientOptions) {
    const authorizationHeader =
      "OAuth " +
      getHeader({
        oauth_consumer_key: options.consumerKey,
        oauth_nonce: Date.now(),
        oauth_signature:
          options.consumerSecret + "&" + options.oAuthTokenSecret,
        oauth_signature_method: "PLAINTEXT",
        oauth_timestamp: Date.now(),
        oauth_token: options.oAuthToken,
        oauth_version: "1.0",
      });

    this.headers = new Headers({
      Accept:
        "application/vnd.discogs." + API_VERSION + OUTPUT_FORMAT + "+json",
      Authorization: authorizationHeader,
      Connection: "close",
      "Content-Type": "application/json",
      "User-Agent": options.userAgent,
    });
  }

  private headers: Headers;

  private async fetch<T>(uri: string, method: "GET" | "POST" = "GET") {
    const response = await fetch(API_BASE_URL + uri, {
      method,
      headers: this.headers,
    });

    const body = await response.json();

    if (response.ok) {
      return body as T;
    }

    throw new Error(body);
  }

  public async getIdentity() {
    return this.fetch<Identity>("/oauth/identity");
  }

  public async getArtist(id: number) {
    throw new Error("Not implemented");
  }

  public async getArtistReleases(id: number) {
    throw new Error("Not implemented");
  }

  public async getLabel(id: number) {
    throw new Error("Not implemented");
  }

  public async getLabelReleases(id: number) {
    throw new Error("Not implemented");
  }

  public async getLists() {
    throw new Error("Not implemented");
  }

  public async getListsForUser() {
    throw new Error("Not implemented");
  }

  public async getListItems() {
    throw new Error("Not implemented");
  }

  public async addToWantlist() {
    throw new Error("Not implemented");
  }

  public async getMaster() {
    throw new Error("Not implemented");
  }

  public async getMasterVersions() {
    throw new Error("Not implemented");
  }

  public async getRelease() {
    throw new Error("Not implemented");
  }
}

function getHeader(obj: Record<string, string | number | boolean>): string {
  let header = "";

  for (const [key, value] of Object.entries(obj)) {
    header += key;
    header += '="';
    header += value;
    header += '",';
  }

  return header.slice(0, -1);
}

interface Identity {
  id: number;
  username: string;
  resource_url: string;
  consumer_name: string;
}
