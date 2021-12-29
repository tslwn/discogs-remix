import { LoaderFunction, useLoaderData } from 'remix';
import Layout from '~/components/Layout';
import { discogsFetchFactory } from '~/lib/auth';
import { getSession } from '~/lib/sessions';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  try {
    const fetch = discogsFetchFactory(session);

    const { username }: { username: string } = await (
      await fetch('oauth/identity')
    ).json();

    const profile = await fetch(`users/${username}`);

    return profile.json();
  } catch (error) {
    return null;
  }
};

export default function Index() {
  const data = useLoaderData<{ name: string; username: string }>();

  return (
    <Layout>
      <div className="p-6">
        <p>{data.username}</p>
        <p>{data.name}</p>
      </div>
    </Layout>
  );
}
