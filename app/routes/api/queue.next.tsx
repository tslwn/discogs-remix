import { json } from 'remix';
import type { ActionFunction } from 'remix';
import { commitSession, getSession } from '~/lib/sessions.server';
import type { Queue } from '~/types/queue';

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  let queue: Queue = session.get('queue') ?? [];

  queue.shift();

  session.set('queue', queue);

  return json(queue, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};
