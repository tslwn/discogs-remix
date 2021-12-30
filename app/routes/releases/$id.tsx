import { useLoaderData } from 'remix';
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
    throw new Error('Expected release ID parameter');
  }

  return client.getRelease(params.id);
};

export default function Route() {
  const data = useLoaderData<Awaited<ReturnType<typeof loader>>>();

  const artists = data.artists.reduce(
    (artists, artist) =>
      [artists, artist.anv !== '' ? artist.anv : artist.name, artist.join].join(
        ' '
      ),
    ''
  );

  return (
    <Layout>
      <div className="p-4 text-center">
        {data.images ? (
          <img
            alt={`${artists} - ${data.title}`}
            className="mb-4"
            src={
              data.images?.filter((image) => image.type === 'primary')[0].uri
            }
          ></img>
        ) : null}
        <h1 className="text-xl">{data.title}</h1>
        <h2 className="text-lg">{artists}</h2>
      </div>
    </Layout>
  );
}
