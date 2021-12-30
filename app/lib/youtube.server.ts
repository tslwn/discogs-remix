import { envVar } from './env.server';

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
