import { redirect } from 'remix';
import type { LoaderFunction } from 'remix';
import Layout from '~/components/Layout';
import { isAuthenticated } from '~/lib/auth';
import { getSession } from '~/lib/sessions';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  if (!(await isAuthenticated(session))) {
    return redirect('/auth');
  }

  return null;
};

export default function Index() {
  return (
    <Layout>
      <div className="p-6">
        <p>Home</p>
      </div>
    </Layout>
  );
}
