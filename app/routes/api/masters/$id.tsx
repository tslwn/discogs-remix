import { useLoaderData } from 'remix';
import type { LoaderFunction } from 'remix';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import { Disclosure } from '@headlessui/react';
import ArtistLinks from '~/components/ArtistLinks';
import Link from '~/components/Link';
import Page from '~/components/Page';
import { getSessionAndClient } from '~/lib/client.server';
import { concatenateArtists, primaryOrFirstImage } from '~/lib/release';
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

  const artists = concatenateArtists(master.artists);

  const src = primaryOrFirstImage(master.images)?.uri;

  return (
    <Page>
      <div className="flex mb-4">
        {src !== undefined ? (
          <img
            alt={`${artists} - ${master.title}`}
            className="h-56 w-56 mr-4"
            src={src}
          ></img>
        ) : null}
        <div>
          <h2 className="text-xl">{master.title}</h2>
          <h3 className="text-lg">
            <ArtistLinks artists={master.artists} />
          </h3>
        </div>
      </div>
      <div>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button>
                <div className="flex items-center mb-4">
                  <h4 className="mr-2 text-lg">Versions</h4>
                  {open ? (
                    <ChevronUpIcon className="h-5 w-5" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5" />
                  )}
                </div>
              </Disclosure.Button>
              <Disclosure.Panel>
                <table className="table-auto text-left w-full">
                  <thead>
                    <tr>
                      <th>Title (Format)</th>
                      <th>Label</th>
                      <th>Cat #</th>
                      <th>Country</th>
                      <th>Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {masterVersions.versions.map((version) => (
                      <tr key={version.id}>
                        <td>
                          <Link to={`/api/releases/${version.id}`}>
                            {version.title}
                          </Link>{' '}
                          ({version.major_formats})
                        </td>
                        <td>{version.label}</td>
                        <td>{version.catno}</td>
                        <td>{version.country}</td>
                        <td>
                          {version.released !== '0'
                            ? version.released
                            : 'Unknown'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </Page>
  );
}
