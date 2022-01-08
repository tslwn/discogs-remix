import { useLoaderData } from 'remix';
import type { LoaderFunction } from 'remix';
import Page from '~/components/Page';
import AddToQueue from '~/components/AddToQueue';
import { getSessionAndClient } from '~/lib/client.server';
import {
  formatReleaseArtists,
  formatReleaseFormats,
  formatReleaseLabels,
  primaryOrFirstImage,
} from '~/lib/release';
import { filterVideos } from '~/lib/videos.server';
import type { Release } from '~/types/discojs';
import Collapsible from '~/components/Collapsible';
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
  const release = useLoaderData<Release>();

  const src = primaryOrFirstImage(release.images)?.uri;

  return (
    <Page>
      <ReleaseHeading
        artists={release.artists}
        title={release.title}
        src={src}
        year={release.year}
        country={release.country}
        // TODO: another problem with `discojs` type definitions
        // @ts-ignore
        formats={formatReleaseFormats(release.formats)}
        labels={formatReleaseLabels(release.labels)}
        genres={release.genres}
        styles={release.styles}
      />
      <div className="flex h-16 items-center">
        <AddToQueue
          item={{
            id: release.id,
            artists: formatReleaseArtists(release.artists),
            title: release.title,
            src,
          }}
          text
        />
      </div>
      <div className="border-b border-neutral-200 mb-4">
        <Collapsible
          heading="Tracklist"
          panel={
            <table className="mb-2 table-auto w-full">
              <tbody>
                {release.tracklist?.map((track) => (
                  <tr key={`${track.position} ${track.title}`}>
                    {track.type_ !== 'track' ? (
                      <td className="font-semibold my-2" colSpan={3}>
                        {track.title}
                      </td>
                    ) : (
                      <>
                        <td className="w-8">{track.position}</td>
                        <td>{track.title}</td>
                        <td className="text-right">{track.duration}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          }
        />
      </div>
    </Page>
  );
}
