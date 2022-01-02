import { redirect, useLoaderData } from 'remix';
import type { LoaderFunction } from 'remix';
import { isAuthenticated } from '~/lib/auth.server';
import { clientFactory } from '~/lib/client.server';
import { getSession } from '~/lib/sessions.server';
import { Identity } from '~/types/discojs';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  if (!isAuthenticated(session)) {
    return redirect('/auth');
  }

  const client = clientFactory(session);

  const identity = await client.getIdentity();

  return identity;
};

export default function Route() {
  const data = useLoaderData<Identity>();

  return (
    <div className="p-4">
      <p>You are signed in as {data.username}.</p>
    </div>
  );
}
