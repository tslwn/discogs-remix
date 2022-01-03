import { json } from 'remix';
import type { ActionFunction } from 'remix';
import { commitSession, getSession } from '~/lib/sessions.server';
import type { Queue } from '~/types/queue';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const id = Number(formData.get('id'));
  const artists = formData.get('artists') as string;
  const title = formData.get('title') as string;
  const src = formData.get('src') as string | undefined;

  const session = await getSession(request.headers.get('Cookie'));

  let queue: Queue = session.get('queue') ?? [];

  queue.push({ id, artists, title, src });

  session.set('queue', queue);

  return json(queue, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};
