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

  private async fetch<T>(uri: string, method: "GET" | "POST" | "PUT" = "GET") {
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

  /// Database

  public async getRelease(releaseId: number, currAbbr?: CurrencyAbbreviation) {
    const searchParams = getSearchParams({ currAbbr });
    return this.fetch<Release>(`/releases/${releaseId}?${searchParams}`);
  }

  public async getReleaseRatingByUser() {
    throw new Error("Not implemented");
  }

  public async updateReleaseRatingByUser() {
    throw new Error("Not implemented");
  }

  public async deleteReleaseRatingByUser() {
    throw new Error("Not implemented");
  }

  public async getCommunityReleaseRating() {
    throw new Error("Not implemented");
  }

  public async getReleaseStats() {
    throw new Error("Not implemented");
  }

  public async getMasterRelease(masterId: number) {
    return this.fetch<MasterRelease>(`/masters/${masterId}`);
  }

  public async getMasterReleaseVersions(
    masterId: number,
    params?: PageParams &
      SortParams<MasterReleaseVersionSortField> & {
        format?: string;
        label?: string;
        released?: string;
        country?: string;
      }
  ) {
    const searchParams = getSearchParams(params);
    return this.fetch<MasterReleaseVersions>(
      `/masters/${masterId}/versions?${searchParams}`
    );
  }

  public async getArtist(artistId: number) {
    return this.fetch<Artist>(`/artists/${artistId}`);
  }

  public async getArtistReleases(
    artistId: number,
    params?: PageParams & SortParams<ReleaseSortField>
  ) {
    const searchParams = getSearchParams(params);
    return this.fetch<ArtistReleases>(
      `/artists/${artistId}/releases?${searchParams}`
    );
  }

  public async getLabel(labelId: number) {
    return this.fetch<Label>(`/labels/${labelId}`);
  }

  public async getLabelReleases(labelId: number, params?: PageParams) {
    const searchParams = getSearchParams(params);
    return this.fetch<LabelReleases>(
      `/labels/${labelId}/releases?${searchParams}`
    );
  }

  public async search() {
    throw new Error("Not implemented");
  }

  /// Inventory export

  /// Inventory upload

  /// User identity

  public async getIdentity() {
    return this.fetch<Identity>("/oauth/identity");
  }

  public async getProfile(username: string) {
    return this.fetch<Profile>(`/users/${username}`);
  }

  /// User collection

  /// User wantlist

  public async getUserWants(username: string, params?: PageParams) {
    const searchParams = getSearchParams(params);
    return this.fetch<UserWants>(`/users/${username}/wants?${searchParams}`);
  }

  public async addToWantlist(
    username: string,
    releaseId: number,
    notes?: string,
    rating?: number
  ) {
    const searchParams = getSearchParams({ notes, rating });
    return this.fetch<Want>(
      `/users/${username}/wants/${releaseId}?${searchParams}`,
      "PUT"
    );
  }

  /// User lists

  public async getUserLists(username: string, params?: PageParams) {
    const searchParams = getSearchParams(params);
    return this.fetch<UserLists>(`/users/${username}/lists?${searchParams}`);
  }

  public async getList(listId: number) {
    return this.fetch<List>(`/lists/${listId}`);
  }
}

/// Utils

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

function getSearchParams(params?: {}): string {
  if (params === undefined) {
    return "";
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      // @ts-ignore TODO
      searchParams.append(key, value.toString());
    }
  }

  return searchParams.toString();
}

/// Types

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

export enum CommunityStatus {
  ACCEPTED = "Accepted",
}

export enum CurrencyAbbreviation {
  USD = "USD",
  GBP = "GBP",
  EUR = "EUR",
  CAD = "CAD",
  AUD = "AUD",
  JPY = "JPY",
  CHF = "CHF",
  MXN = "MXN",
  BRL = "BRL",
  NZD = "NZD",
  SEK = "SEK",
  ZAR = "ZAR",
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

export enum SearchType {
  ARTIST = "artist",
  LABEL = "label",
  MASTER = "master",
  RELEASE = "release",
}

// TODO: combine with the above?
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

export enum MasterReleaseVersionSortField {
  RELEASED = "released",
  TITLE = "title",
  FORMAT = "format",
  LABEL = "label",
  CATNO = "catno",
  COUNTRY = "country",
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

export interface Image {
  type: ImageType;
  uri: string;
  resource_url: string;
  uri150: string;
  width: number;
  height: number;
}

export interface Stats {
  in_wantlist: number;
  in_collection: number;
}

export interface Video {
  uri: string;
  title: string;
  description: string;
  duration: number;
  embed: boolean;
}

export interface Track {
  position: string;
  type_: "track" | string;
  title: string;
  duration: string;
  extraartists?: ReleaseArtist[];
}

export interface MasterRelease {
  id: number;
  main_release: number;
  most_recent_release: number;
  resource_url: string;
  uri: string;
  versions_url: string;
  main_release_url: string;
  most_recent_release_url: string;
  num_for_sale: number;
  lowest_price: number;
  images: Image[];
  genres: string[];
  styles: string[];
  year: number;
  tracklist: Track[];
  artists: ReleaseArtist[];
  title: string;
  data_quality: DataQuality;
  videos: Video[];
}

export interface MasterReleaseVersion {
  status: CommunityStatus;
  stats: {
    user: Stats;
    community: Stats;
  };
  thumb: string;
  format: string;
  country: string;
  title: string;
  label: string;
  released: string;
  major_formats: string[];
  catno: string;
  resource_url: string;
  id: number;
}

export interface MasterReleaseVersions {
  pagination: Pagination;
  versions: MasterReleaseVersion[];
}

export interface ArtistMember {
  active: boolean;
  id: number;
  name: string;
  resource_url: string;
}

export interface Artist {
  name: string;
  namevariations: string[];
  profile: string;
  releases_url: string;
  resource_url: string;
  uri: string;
  urls: string[];
  data_quality: DataQuality;
  id: number;
  images: Image[];
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
  type: SearchType;
  year: number;
}

export interface ArtistReleases {
  pagination: Pagination;
  releases: ArtistRelease[];
}

export interface Sublabel {
  resource_url: string;
  id: number;
  name: string;
}

export interface Label {
  profile: string;
  releases_url: string;
  name: string;
  contact_inf: string;
  uri: string;
  sublabels: Sublabel[];
  urls: string[];
  images: Image[];
  resource_url: string;
  id: number;
  data_quality: DataQuality;
}

export interface LabelRelease {
  artist: string;
  catno: string;
  format: string;
  id: number;
  resource_url: string;
  status: CommunityStatus;
  thumb: string;
  title: string;
  year: number;
}

export interface LabelReleases {
  pagination: Pagination;
  releases: LabelRelease[];
}

export interface Identity {
  id: number;
  username: string;
  resource_url: string;
  consumer_name: string;
}

export interface Profile {
  profile: string;
  wantlist_url: string;
  rank: number;
  num_pending: number;
  id: number;
  num_for_sale: number;
  home_page: string;
  location: string;
  collection_folders_url: string;
  username: string;
  collection_fields_url: string;
  releases_contributed: number;
  registered: string;
  rating_avg: number;
  num_collection: number;
  releases_rated: number;
  num_lists: number;
  name: string;
  num_wantlist: number;
  inventory_url: string;
  avatar_url: string;
  banner_url: string;
  uri: string;
  resource_url: string;
  buyer_rating: number;
  buyer_rating_stars: number;
  buyer_num_ratings: number;
  seller_rating: number;
  seller_rating_stars: number;
  seller_num_ratings: number;
  curr_abbr: CurrencyAbbreviation;
}

export interface UserList {
  date_added: string;
  date_changed: string;
  name: string;
  id: number;
  uri: string;
  resource_url: string;
  public: boolean;
  description: string;
}

export interface UserLists {
  pagination: Pagination;
  lists: UserList[];
}

export interface ListItemStats {
  community: Stats;
  user: Stats;
}

export interface ListItem {
  type: SearchType;
  id: number;
  comment: string;
  uri: string;
  resource_url: string;
  image_url: string;
  display_title: string;
  stats: ListItemStats;
}

export interface List {
  id: number;
  user: {
    id: number;
    avatar_url: string;
    username: string;
    resource_url: string;
  };
  name: string;
  description: string;
  public: boolean;
  date_added: string;
  date_changed: string;
  uri: string;
  resource_url: string;
  image_url: string;
  items: ListItem[];
}

export interface ReleaseArtist {
  name: string;
  anv: string;
  join: string;
  role: string;
  tracks: string;
  id: number;
  resource_url: string;
  thumbnail_url: string;
}

export interface ReleaseFormat {
  name: string;
  qty: string;
  text: string;
  descriptions: string[];
}

export interface ReleaseLabel {
  name: string;
  catno: string;
  entity_type: string;
  entity_type_name: string;
  id: number;
  resource_url: string;
  thumbnail_url: string;
}

export interface Want {
  basic_information: {
    artists: ReleaseArtist[];
    cover_image: string;
    formats: ReleaseFormat[];
    genres: string[];
    id: number;
    labels: ReleaseLabel[];
    master_id: number | null;
    master_url: string | null;
    resource_url: string;
    styles: string[];
    thumb: string;
    title: string;
    year: number;
  };
  date_aded: string;
  id: number;
  notes: string;
  rating: number;
  resource_url: string;
}

export interface UserWants {
  pagination: Pagination;
  wants: Want[];
}

export interface Release {
  id: number;
  status: CommunityStatus;
  year: number;
  resource_url: string;
  uri: string;
  artists: ReleaseArtist[];
  artists_sort: string;
  labels: ReleaseLabel[];
  series: string[];
  companies: string[];
  formats: ReleaseFormat[];
  data_quality: DataQuality;
  community: {
    have: number;
    want: number;
    rating: {
      count: number;
      average: number;
    };
    submitter: {
      username: string;
      resource_url: string;
    };
    contributors: [];
    data_quality: DataQuality;
    status: CommunityStatus;
  };
  format_quantity: number;
  date_added: string;
  date_changed: string;
  num_for_sale: number;
  lowest_price: number | null;
  master_id: number;
  master_url: string;
  title: string;
  country: string;
  released: string;
  notes: string;
  released_formatted: string;
  identifiers: [];
  videos: Video[];
  genres: string[];
  styles: string[];
  tracklist: Track[];
  extraartists: string[];
  images: Image[];
  thumb: string;
  estimated_weight: number;
  blocked_from_sale: boolean;
}
