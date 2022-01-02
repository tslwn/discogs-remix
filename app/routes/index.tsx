import { redirect } from 'remix';
import type { LoaderFunction } from 'remix';
import { isAuthenticated } from '~/lib/auth.server';
import { getSession } from '~/lib/sessions.server';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  if (!isAuthenticated(session)) {
    return redirect('/auth');
  }

  return redirect('/api');
};
