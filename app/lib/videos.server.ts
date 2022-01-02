import { Release } from '~/types/discojs';
import { envVar } from '~/lib/env.server';

const YOUTUBE_URL_REGEX =
  /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/;

export async function isVideoAvailable(url: string) {
  const matches = url.match(YOUTUBE_URL_REGEX);

  if (matches === null) {
    return false;
  }

  const id = matches[1];

  const response =
    await fetch(`https://www.googleapis.com/youtube/v3/videos?part=status&id=${id}&key=${envVar(
      'YOUTUBE_API_KEY'
    )}
  `);

  const json = await response.json();

  return json.pageInfo.totalResults === 1;
}

export async function filterVideos(release: Release) {
  const videos = [];

  if (release.videos !== undefined) {
    for (const video of release.videos) {
      if (await isVideoAvailable(video.uri)) {
        videos.push(video);
      }
    }
  }

  return { ...release, videos };
}
