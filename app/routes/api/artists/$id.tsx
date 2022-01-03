import { LoaderFunction, useLoaderData } from 'remix';
import ItemCard from '~/components/ItemCard';
import Page from '~/components/Page';
import { getSessionAndClient } from '~/lib/client.server';
import { primaryOrFirstImage } from '~/lib/release';
import type { Artist, ArtistReleases } from '~/types/discojs';

interface RouteParams {
  id: number;
}

function isRouteParams(params: any): params is RouteParams {
  return !Number.isNaN(Number(params.id));
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const { client } = await getSessionAndClient(request);

  if (!isRouteParams(params)) {
    throw new Error('Expected artist ID parameter');
  }

  const artist = await client.getArtist(params.id);

  // TODO: what kind of release? remove duplicates (credits)
  const artistReleases = await client.getArtistReleases(params.id);

  artistReleases.releases.sort((a, b) => (a.year > b.year ? 1 : -1));

  return {
    artist,
    artistReleases,
  };
};

export default function Route() {
  // TODO: is the return type of `getArtist` correct?
  const { artist, artistReleases } = useLoaderData<
    { artist: Artist & { name: string } } & { artistReleases: ArtistReleases }
  >();

  const src = primaryOrFirstImage(artist.images)?.uri;

  return (
    <Page>
      <div className="flex mb-4">
        {src !== undefined ? (
          <img alt={artist.name} className="h-56 mr-4" src={src}></img>
        ) : null}
        <h2 className="text-xl">{artist.name}</h2>
      </div>
      <div>
        <h4 className="mb-4 text-lg">Releases</h4>
        <ul>
          {artistReleases.releases.map((release) => {
            const text =
              release.artist !== artist.name
                ? `${release.artist} - ${release.title}`
                : release.title;

            const to =
              release.type === 'master'
                ? `/api/masters/${release.id}`
                : `/api/releases/${release.id}`;

            return (
              <li className="mb-2" key={release.id}>
                <ItemCard
                  title={{ text, to }}
                  subtitle={release.year?.toString()}
                  image={{
                    alt: text,
                    src: release.thumb,
                  }}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </Page>
  );
}