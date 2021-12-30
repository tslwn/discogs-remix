import { redirect, useLoaderData } from 'remix';
import type { DataFunctionArgs } from '@remix-run/server-runtime';
import Layout from '~/components/Layout';
import { clientFactory } from '~/lib/client.server';
import { getSession } from '~/lib/sessions.server';

export const loader = async ({ request }: DataFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));

  const client = clientFactory(session);

  const profileOrResponse = await client.getProfile();

  // not authenticated
  if (profileOrResponse instanceof Response) {
    return redirect('/auth');
  }

  return profileOrResponse;
};

export default function Route() {
  const data =
    useLoaderData<Exclude<Awaited<ReturnType<typeof loader>>, Response>>();

  return (
    <Layout>
      <div className="p-4">
        <p>Hello, {data.username}.</p>
      </div>
    </Layout>
  );
}
