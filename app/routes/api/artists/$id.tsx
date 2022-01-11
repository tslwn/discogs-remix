import { PhotographIcon } from "@heroicons/react/solid";
import { LoaderFunction, useLoaderData } from "remix";
import ItemCard from "~/components/ItemCard";
import Page from "~/components/Page";
import { primaryOrFirstImage } from "~/lib/release";
import type { Artist, ArtistReleases } from "~/types/discojs";
import { getDiscogsClient } from "~/util/auth.server";

interface RouteParams {
  id: number;
}

function isRouteParams(params: any): params is RouteParams {
  return !Number.isNaN(Number(params.id));
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const client = await getDiscogsClient(request);

  if (!isRouteParams(params)) {
    throw new Error("Expected artist ID parameter");
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
      <div className="flex mb-8">
        <div className="mr-4 overflow-hidden rounded">
          {src !== undefined ? (
            <img alt={artist.name} className="h-56" src={src}></img>
          ) : (
            <div className="bg-neutral-200 flex h-56 items-center justify-center">
              <PhotographIcon className="text-neutral-500 h-5 w-5" />
            </div>
          )}
        </div>
        <h2 className="font-semibold text-3xl">{artist.name}</h2>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Releases</h4>
        <ul>
          {artistReleases.releases.map((release) => {
            const text =
              release.artist !== artist.name
                ? `${release.artist} - ${release.title}`
                : release.title;

            const to =
              release.type === "master"
                ? `/api/masters/${release.id}`
                : `/api/releases/${release.id}`;

            return (
              <li className="mb-4" key={release.id}>
                <ItemCard
                  title={{ text, to }}
                  subtitle={release.year?.toString()}
                  image={{
                    alt: text,
                    src: release.thumb,
                  }}
                  visited
                />
              </li>
            );
          })}
        </ul>
      </div>
    </Page>
  );
}
