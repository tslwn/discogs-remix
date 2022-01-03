import { useLoaderData } from 'remix';
import type { LoaderFunction } from 'remix';
import ArtistLinks from '~/components/ArtistLinks';
import Page from '~/components/Page';
import { getSessionAndClient } from '~/lib/client.server';
import { concatenateArtists, primaryOrFirstImage } from '~/lib/release';
import { filterVideos } from '~/lib/videos.server';
import type { Release } from '~/types/discojs';
import QueueAddForm from '~/components/QueueAddForm';

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
  const release = useLoaderData<Release>();

  const artists = concatenateArtists(release.artists);

  const src = primaryOrFirstImage(release.images)?.uri;

  return (
    <Page>
      <div className="flex mb-4">
        {src !== undefined ? (
          <img
            alt={`${artists} - ${release.title}`}
            className="h-56 w-56 mr-4"
            src={src}
          ></img>
        ) : null}
        <div>
          <h2 className="text-xl">{release.title}</h2>
          <h3 className="text-md">
            <ArtistLinks artists={release.artists} />
          </h3>
        </div>
      </div>
      <QueueAddForm
        item={{ id: release.id, artists, title: release.title, src }}
        text
      />
    </Page>
  );
}
