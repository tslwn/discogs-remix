import { json } from 'remix';
import type { ActionFunction } from 'remix';
import { commitSession, getSession } from '~/lib/sessions.server';
import type { Queue } from '~/types/queue';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const id = Number(formData.get('id'));
  const artists = formData.get('artists');
  const title = formData.get('title');
  const src = formData.get('src');

  if (
    Number.isNaN(id) ||
    typeof artists !== 'string' ||
    typeof title !== 'string' ||
    !(typeof src === 'string' || src === undefined)
  ) {
    throw new Error('Expected form');
  }

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
