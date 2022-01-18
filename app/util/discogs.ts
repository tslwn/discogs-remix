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

  public async getArtist(artistId: number) {
    return this.fetch<Artist>(`/artists/${artistId}`);
  }

  public async getArtistReleases(
    artistId: number,
    options: PageParams & SortParams<ReleaseSortField>
  ) {
    const searchParams = getSearchParams(options);

    return this.fetch<ArtistReleases>(
      `/artists/${artistId}/releases?${searchParams}`
    );
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

function getSearchParams<Field extends string>(
  options: PageParams & SortParams<Field>
): URLSearchParams {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined) {
      searchParams.append(key, value.toString());
    }
  }

  return searchParams;
}

export enum ArtistReleaseRole {
  MAIN = "Main",
  REMIX = "Remix",
  PRODUCER = "Producer",
  CO_PRODUCER = "Co-producer",
  MIXED_BY = "Mixed by",
  APPEARANCE = "Appearance",
  TRACK_APPEARANCE = "TrackAppearance",
  UNOFFICIAL_RELEASE = "UnofficialRelease",
}

export enum DataQuality {
  NEEDS_VOTE = "Needs Vote",
  NEEDS_MINOR_CHANGES = "Needs Minor Changes",
  CORRECT = "Correct",
}

export enum ImageType {
  PRIMARY = "primary",
  SECONDARY = "secondary",
}

export enum ReleaseType {
  MASTER = "master",
  RELEASE = "release",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export enum ReleaseSortField {
  YEAR = "year",
  TITLE = "title",
  FORMAT = "format",
}

export interface SortParams<Field extends string> {
  sort?: Field;
  sort_order?: SortOrder;
}

export interface PageParams {
  page?: number;
  per_page?: number;
}

export interface Pagination {
  per_page: number;
  items: number;
  page: number;
  urls: {
    first: string;
    next: string;
    prev: string;
    last: string;
  };
  pages: number;
}

export interface Identity {
  id: number;
  username: string;
  resource_url: string;
  consumer_name: string;
}

export interface ArtistImage {
  height: number;
  resource_url: string;
  type: ImageType;
  uri: string;
  uri150: string;
  width: number;
}

export interface ArtistMember {
  active: boolean;
  id: number;
  name: string;
  resource_url: string;
}

export interface Artist {
  // Not in example response body
  // https://www.discogs.com/developers#page:database,header:database-artist
  name: string;
  namevariations: string[];
  profile: string;
  releases_url: string;
  resource_url: string;
  uri: string;
  urls: string[];
  data_quality: DataQuality;
  id: number;
  images: ArtistImage[];
  members: ArtistMember[];
}

export interface ArtistRelease {
  artist: string;
  id: number;
  main_release: number;
  resource_url: string;
  role: ArtistReleaseRole;
  thumb: string;
  title: string;
  type: ReleaseType;
  year: number;
}

export interface ArtistReleases {
  pagination: Pagination;
  releases: ArtistRelease[];
}
