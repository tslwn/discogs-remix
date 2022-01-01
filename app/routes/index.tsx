import { redirect, useLoaderData } from 'remix';
import type { DataFunctionArgs } from '@remix-run/server-runtime';
import Layout from '~/components/Layout';
import { clientFactory } from '~/lib/client.server';
import { getSession } from '~/lib/sessions.server';
import { isAuthenticated } from '~/lib/auth.server';

export const loader = async ({ request }: DataFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));

  if (!isAuthenticated(session)) {
    return redirect('/auth');
  }

  const client = clientFactory(session);

  const profile = await client.getProfile();

  return profile;
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
