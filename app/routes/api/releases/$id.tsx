import { useLoaderData } from 'remix';
import type { LoaderFunction } from 'remix';
import Page from '~/components/Page';
import QueueAddForm from '~/components/QueueAddForm';
import { getSessionAndClient } from '~/lib/client.server';
import { concatenateArtists, primaryOrFirstImage } from '~/lib/release';
import { filterVideos } from '~/lib/videos.server';
import type { Release } from '~/types/discojs';
import ReleaseHeading from '~/components/ReleaseHeading';

interface RouteParams {
  id: number;
}

function isRouteParams(params: any): params is RouteParams {
  return !Number.isNaN(Number(params.id));
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const { client } = await getSessionAndClient(request);

  if (!isRouteParams(params)) {
    throw new Error('Expected release ID parameter');
  }

  const release = await client.getRelease(params.id);

  return filterVideos(release);
};

export default function Route() {
  const { id, artists, title, images, year, genres, styles } =
    useLoaderData<Release>();

  const src = primaryOrFirstImage(images)?.uri;

  return (
    <Page>
      <ReleaseHeading
        artists={artists}
        title={title}
        src={src}
        year={year}
        genres={genres}
        styles={styles}
      />
      <QueueAddForm
        item={{
          id,
          artists: concatenateArtists(artists),
          title,
          src,
        }}
        text
      />
    </Page>
  );
}
