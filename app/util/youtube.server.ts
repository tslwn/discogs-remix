import { Release } from "~/types/discojs";

export async function isVideoAvailable(url: string) {
  const matches = url.match(
    /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/
  );

  if (matches === null) {
    return false;
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=status&id=${matches[1]}&key=${process.env.YOUTUBE_API_KEY}`
  );

  const json = await response.json();

  return json.pageInfo.totalResults === 1;
}

export async function availableVideos(videos: Release["videos"]) {
  const available = [];
  if (videos !== undefined) {
    for (const video of videos) {
      if (await isVideoAvailable(video.uri)) {
        available.push(video);
      }
    }
  }
  return available;
}
