import { Discojs, SearchTypeEnum } from "discojs";

const client = new Discojs();

export type Identity = Awaited<ReturnType<typeof client.getIdentity>>;

export type Profile = Awaited<ReturnType<typeof client.getProfile>>;

export type Artist = Awaited<ReturnType<typeof client.getArtist>>;

type _ArtistReleases = Awaited<ReturnType<typeof client.getArtistReleases>>;

type ReleaseType = {
  type: SearchTypeEnum.MASTER | SearchTypeEnum.RELEASE;
};

export type ArtistReleases = Pick<_ArtistReleases, "pagination"> & {
  releases: (_ArtistReleases["releases"][number] & ReleaseType)[];
};

export type Label = Awaited<ReturnType<typeof client.getLabel>>;

type _LabelReleases = Awaited<ReturnType<typeof client.getLabelReleases>>;

export type LabelReleases = Pick<_LabelReleases, "pagination"> & {
  releases: (_LabelReleases["releases"][number] & ReleaseType)[];
};

export type Master = Awaited<ReturnType<typeof client.getMaster>>;

export type MasterVersions = Awaited<
  ReturnType<typeof client.getMasterVersions>
>;

export type Release = Awaited<ReturnType<typeof client.getRelease>> &
  ReleaseType;

export type Videos = Exclude<Release["videos"], undefined>;

export type Video = Videos[number];

export type Role =
  | "Main"
  | "Remix"
  | "Producer"
  | "Co-producer"
  | "Mixed by"
  | "Appearance"
  | "TrackAppearance"
  | "UnofficialRelease";
