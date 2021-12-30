import { useLoaderData } from 'remix';
import type { DataFunctionArgs } from '@remix-run/server-runtime';
import Layout from '~/components/Layout';
import { clientFactory } from '~/lib/client';
import { getSession } from '~/lib/sessions';

interface RouteParams {
  username: string;
}

function isRouteParams(params: any): params is RouteParams {
  return typeof params.username === 'string';
}

export const loader = async ({ params, request }: DataFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));

  const client = clientFactory(session);

  if (!isRouteParams(params)) {
    throw new Error('Expected username parameter');
  }

  return client.getProfileForUser(params.username);
};

export default function Route() {
  const data = useLoaderData<Awaited<ReturnType<typeof loader>>>();

  return (
    <Layout>
      <div className="p-4">
        <p>{data.username}</p>
      </div>
    </Layout>
  );
}
