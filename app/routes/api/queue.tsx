import { Form, json, useLoaderData, useTransition } from 'remix';
import type { ActionFunction, LoaderFunction } from 'remix';
import Page from '~/components/Page';
import { commitSession, getSession } from '~/lib/sessions.server';
import { Queue } from '~/types/queue';
import NowPlaying from '~/components/NowPlaying';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  const queue: Queue = session.get('queue') ?? [];

  return queue;
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  session.set('queue', []);

  return json(null, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

export default function Route() {
  const data = useLoaderData<Queue>();

  const transition = useTransition();

  return (
    <Page>
      <div className="mb-4 flex justify-between">
        <h2 className="text-xl">Queue</h2>
        <Form method="post">
          <button disabled={transition.state === 'submitting'}>Clear</button>
        </Form>
      </div>
      <ul>
        {data.map((item, index) => (
          <li className="mb-2" key={index}>
            <NowPlaying
              item={item}
              left={<div className="text-md w-3">{index}</div>}
            />
          </li>
        ))}
      </ul>
    </Page>
  );
}
