import { Discojs } from 'discojs';

const client = new Discojs();

export type Identity = Awaited<ReturnType<typeof client.getIdentity>>;

export type Profile = Awaited<ReturnType<typeof client.getProfile>>;

export type Artist = Awaited<ReturnType<typeof client.getArtist>>;

export type Label = Awaited<ReturnType<typeof client.getLabel>>;

export type LabelReleases = Awaited<ReturnType<typeof client.getLabelReleases>>;

export type Master = Awaited<ReturnType<typeof client.getMaster>>;

export type Release = Awaited<ReturnType<typeof client.getRelease>>;
