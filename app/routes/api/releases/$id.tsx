import { useLoaderData } from 'remix';
import type { LoaderFunction } from 'remix';
import ArtistLinks from '~/components/ArtistLinks';
import Chips from '~/components/Chips';
import Page from '~/components/Page';
import QueueAddForm from '~/components/QueueAddForm';
import { getSessionAndClient } from '~/lib/client.server';
import { concatenateArtists, primaryOrFirstImage } from '~/lib/release';
import { filterVideos } from '~/lib/videos.server';
import type { Release } from '~/types/discojs';

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
          <div>
            <h2 className="text-xl">
              <ArtistLinks artists={release.artists} />
              {' - '}
              {release.title}
            </h2>
          </div>
          <div className="flex">
            <div className="flex flex-wrap items-center">
              <div className="mb-1 mr-3 text-lg">{release.year}</div>
              <Chips chips={release.genres ?? []} className="bg-gray-300" />
              <Chips chips={release.styles ?? []} className="bg-gray-200" />
            </div>
            {/* <div className="w-1/2"></div> */}
          </div>
        </div>
      </div>
      <QueueAddForm
        item={{ id: release.id, artists, title: release.title, src }}
        text
      />
    </Page>
  );
}
