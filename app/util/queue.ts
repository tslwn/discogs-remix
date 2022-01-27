import type { QueueItem } from "~/types/queue";
import { formatReleaseArtists, primaryOrFirstImage } from "~/util/release";
import type { Release } from "./discogs";
import { SearchType } from "./discogs";

export function encodeItem({ id, artists, title, src, type }: QueueItem) {
  return {
    id,
    artists: encodeURI(artists),
    title: encodeURI(title),
    src: src !== undefined ? encodeURI(src) : undefined,
    type,
  };
}

export function decodeItem({ id, artists, title, src, type }: QueueItem) {
  return {
    id,
    artists: decodeURI(artists),
    title: decodeURI(title),
    src: src !== undefined ? decodeURI(src) : undefined,
    type,
  };
}

export function releaseToItem({
  id,
  artists,
  title,
  images,
  type,
}: Pick<Release, "id" | "artists" | "title" | "images"> & {
  type?: SearchType;
}): QueueItem {
  return {
    id,
    artists: formatReleaseArtists(artists),
    title,
    src: primaryOrFirstImage(images)?.uri,
    type: type || SearchType.RELEASE,
  };
}
