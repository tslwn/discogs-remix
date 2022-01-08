import { PhotographIcon } from '@heroicons/react/solid';
import { LoaderFunction, useLoaderData } from 'remix';
import ItemCard from '~/components/ItemCard';
import Page from '~/components/Page';
import { getSessionAndClient } from '~/lib/client.server';
import { primaryOrFirstImage } from '~/lib/release';
import type { Label, LabelReleases } from '~/types/discojs';

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

  const label = await client.getLabel(params.id);

  // TODO: what kind of release? remove duplicates (credits)
  const labelReleases = await client.getLabelReleases(params.id);

  labelReleases.releases.sort((a, b) => {
    if (a.year === 0) {
      return 1;
    }
    return a.year > b.year ? 1 : -1;
  });

  return {
    label,
    labelReleases,
  };
};

export default function Route() {
  const { label, labelReleases } = useLoaderData<{
    label: Label;
    labelReleases: LabelReleases;
  }>();

  const src = primaryOrFirstImage(label.images)?.uri;

  return (
    <Page>
      <div className="flex mb-8">
        {src !== undefined ? (
          <img alt={label.name} className="h-56 mr-4" src={src}></img>
        ) : (
          <div className="bg-neutral-200 flex h-56 items-center justify-center mr-4 w-56">
            <PhotographIcon className="text-neutral-500 h-5 w-5" />
          </div>
        )}
        <h2 className="font-semibold text-3xl">{label.name}</h2>
      </div>
      <div>
        <h4 className="mb-4 text-lg">Releases</h4>
        <ul>
          {labelReleases.releases.map((release) => {
            const text = `${release.artist} - ${release.title}`;

            const to =
              release.type === 'master'
                ? `/api/masters/${release.id}`
                : `/api/releases/${release.id}`;

            return (
              <li className="mb-4" key={release.id}>
                <ItemCard
                  title={{ text, to }}
                  subtitle={release.year !== 0 ? release.year.toString() : ''}
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
