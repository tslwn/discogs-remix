import clsx from 'clsx';
import { useLoaderData } from 'remix';
import type { LoaderFunction } from 'remix';
import Collapsible from '~/components/Collapsible';
import Link from '~/components/Link';
import Page from '~/components/Page';
import ReleaseHeading from '~/components/ReleaseHeading';
import { getSessionAndClient } from '~/lib/client.server';
import { primaryOrFirstImage } from '~/lib/release';
import type { Master, MasterVersions } from '~/types/discojs';

interface RouteParams {
  id: number;
}

function isRouteParams(params: any): params is RouteParams {
  return !Number.isNaN(Number(params.id));
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const { client } = await getSessionAndClient(request);

  if (!isRouteParams(params)) {
    throw new Error('Expected master ID parameter');
  }

  const master = await client.getMaster(params.id);

  const masterVersions = await client.getMasterVersions(params.id);

  return {
    master,
    masterVersions,
  };
};

export default function Route() {
  const { master, masterVersions } =
    useLoaderData<{ master: Master; masterVersions: MasterVersions }>();

  const src = primaryOrFirstImage(master.images)?.uri;

  return (
    <Page>
      <ReleaseHeading
        artists={master.artists}
        title={master.title}
        src={src}
        year={master.year}
        genres={master.genres}
        styles={master.styles}
      />
      <div className="border-b border-neutral-200 my-4">
        <Collapsible
          heading="Tracklist"
          panel={
            <ul className="mb-2">
              {master.tracklist.map((track) => (
                <li className="flex justify-between">
                  <span
                    className={clsx(
                      track.type_ !== 'track' && 'font-semibold my-2'
                    )}
                  >
                    {track.title}
                  </span>
                  <span>{track.duration}</span>
                </li>
              ))}
            </ul>
          }
        />
      </div>
      <div className="border-b border-neutral-200 mb-4">
        <Collapsible
          heading="Versions"
          panel={
            <table className="mb-2 table-auto text-left w-full">
              <thead>
                <tr>
                  <th className="font-semibold">Title (Format)</th>
                  <th className="font-semibold">Label</th>
                  <th className="font-semibold">Cat #</th>
                  <th className="font-semibold">Country</th>
                  <th className="font-semibold text-right">Year</th>
                </tr>
              </thead>
              <tbody>
                {masterVersions.versions.map((version) => (
                  <tr key={version.id}>
                    <td>
                      <Link to={`/api/releases/${version.id}`}>
                        {version.title !== master.title ? version.title : null}{' '}
                        {version.major_formats}
                      </Link>{' '}
                      <span className="text-xs">{version.format}</span>
                    </td>
                    <td>{version.label}</td>
                    <td>{version.catno}</td>
                    <td>{version.country}</td>
                    <td className="text-right">
                      {version.released !== '0' ? version.released : 'Unknown'}
                    </td>
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
