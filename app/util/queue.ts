import type { Release } from "~/types/discojs";
import type { QueueItem } from "~/types/queue";
import { formatReleaseArtists, primaryOrFirstImage } from "~/util/release";

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
  type?: "master" | "release";
}): QueueItem {
  return {
    id,
    artists: formatReleaseArtists(artists),
    title,
    src: primaryOrFirstImage(images)?.uri,
    type: type || "release",
  };
}
