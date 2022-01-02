import { Form, json, useLoaderData, useTransition } from 'remix';
import type { ActionFunction, LoaderFunction } from 'remix';
import Page from '~/components/Page';
import { getSessionAndClient } from '~/lib/client.server';
import { concatenateArtists, primaryOrFirstImage } from '~/lib/release';
import { commitSession, getSession } from '~/lib/sessions.server';
import { filterVideos } from '~/lib/videos.server';
import { Release } from '~/types/discojs';
import { Queue } from '~/types/queue';

interface RouteParams {
  id: number;
}

function isRouteParams(params: any): params is RouteParams {
  return !Number.isNaN(Number(params.id));
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const { client } = await getSessionAndClient(request);

  if (!isRouteParams(params)) {
    throw new Error('Expected release ID parameter');
  }

  const release = await client.getRelease(params.id);

  return filterVideos(release);
};

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

export default function Route() {
  const data = useLoaderData<Release>();

  const transition = useTransition();

  const artists = concatenateArtists(data.artists);

  const src = primaryOrFirstImage(data.images)?.uri;

  return (
    <Page>
      <div className="flex mb-4">
        {src !== undefined ? (
          <img
            alt={`${artists} - ${data.title}`}
            className="h-56 w-56 mr-4"
            src={src}
          ></img>
        ) : null}
        <div>
          <h2 className="text-xl">{data.title}</h2>
          <h3 className="text-md">{artists}</h3>
        </div>
      </div>
      <div>
        <Form method="post">
          <input hidden id="id" name="id" readOnly value={data.id} />
          <input hidden id="artists" name="artists" readOnly value={artists} />
          <input hidden id="title" name="title" readOnly value={data.title} />
          <input hidden id="src" name="src" readOnly value={src} />
          <button
            className="hover:underline"
            disabled={transition.state === 'submitting'}
          >
            Add to queue
          </button>
        </Form>
      </div>
    </Page>
  );
}
