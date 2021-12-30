import { useLoaderData } from 'remix';
import type { DataFunctionArgs } from '@remix-run/server-runtime';
import Layout from '~/components/Layout';
import YouTubePlayer from '~/components/YouTubePlayer';
import { clientFactory } from '~/lib/client.server';
import { getSession } from '~/lib/sessions.server';
import { isVideoAvailable } from '~/lib/youtube.server';

interface RouteParams {
  id: number;
}

function isRouteParams(params: any): params is RouteParams {
  return !Number.isNaN(Number(params.id));
}

export const loader = async ({ params, request }: DataFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));

  const client = clientFactory(session);

  if (!isRouteParams(params)) {
    throw new Error('Expected release ID parameter');
  }

  const release = await client.getRelease(params.id);

  // remove videos that are no longer available
  const videos = [];

  if (release.videos !== undefined) {
    for (const video of release.videos) {
      if (await isVideoAvailable(video.uri)) {
        videos.push(video);
      }
    }
  }

  release.videos = videos;

  return release;
};

export default function Route() {
  const data = useLoaderData<Awaited<ReturnType<typeof loader>>>();

  const artists = data.artists.reduce(
    (artists, artist) =>
      [artists, artist.anv !== '' ? artist.anv : artist.name, artist.join]
        .join(' ')
        .replace(' , ', ', '),
    ''
  );

  const image =
    data.images?.filter((image) => image.type === 'primary')[0] ??
    (data.images && data.images[0]);

  return (
    <Layout>
      <div className="p-4">
        <div className="mb-2">
          {image !== undefined ? (
            <img
              alt={`${artists}- ${data.title}`}
              className="mb-4 mx-auto"
              src={image.uri}
            ></img>
          ) : null}
        </div>
        <div className="mb-2 text-center">
          <h1 className="text-xl">{data.title}</h1>
          <h2 className="text-lg">{artists}</h2>
        </div>
        <div>
          {data.videos !== undefined && data.videos?.length > 0 ? (
            <YouTubePlayer videos={data.videos} />
          ) : (
            <p className="text-center">No videos</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
