import { Link, useLoaderData } from 'remix';
import type { DataFunctionArgs } from '@remix-run/server-runtime';
import Layout from '~/components/Layout';
import { clientFactory } from '~/lib/client.server';
import { getSession } from '~/lib/sessions.server';

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
    throw new Error('Expected label ID parameter');
  }

  return client.getLabelReleases(params.id);
};

type LabelReleases = Awaited<ReturnType<typeof loader>>;

export default function Route() {
  const data = useLoaderData<LabelReleases>();

  return (
    <Layout>
      <div className="p-4">
        {data.releases.map((release) => (
          <Release release={release} />
        ))}
      </div>
    </Layout>
  );
}

interface ReleaseProps {
  release: LabelReleases['releases'][number];
}

function Release({ release }: ReleaseProps) {
  return (
    <div className="flex text-sm">
      <Link
        className="hover:underline overflow-hidden text-ellipsis whitespace-nowrap"
        to={`/releases/${release.id}`}
      >
        {release.artist} - {release.title} ({release.format}) - {release.catno}{' '}
        - {release.year}
      </Link>
    </div>
  );
}
