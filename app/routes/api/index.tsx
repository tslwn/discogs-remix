import { redirect, useLoaderData } from 'remix';
import type { LoaderFunction } from 'remix';
import Link from '~/components/Link';
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
      <p className="mb-2">You are signed in as {data.username}.</p>
      <p className="mb-2">Try these links:</p>
      <ul className="list-disc ml-4">
        <li>
          <Link to={`/api/labels/3193`}>Threshold House</Link> (label)
        </li>
        <li>
          <Link to={`/api/artists/660`}>Coil</Link> (artist)
        </li>
        <li>
          <Link to={`/api/masters/5656`}>Musick To Play In The Dark</Link>{' '}
          (master)
        </li>
        <li>
          <Link to={`/api/releases/56898`}>Musick To Play In The Dark²</Link>{' '}
          (version)
        </li>
      </ul>
    </div>
  );
}
