import { Outlet, redirect, useLoaderData } from 'remix';
import type { LoaderFunction } from 'remix';
import BottomBar from '~/components/BottomBar';
import Sidebar from '~/components/Sidebar';
import { isAuthenticated } from '~/lib/auth.server';
import { clientFactory } from '~/lib/client.server';
import { formatReleaseArtists, primaryOrFirstImage } from '~/lib/release';
import { getSession } from '~/lib/sessions.server';
import { filterVideos } from '~/lib/videos.server';
import { Release } from '~/types/discojs';
import { Queue } from '~/types/queue';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  if (!isAuthenticated(session)) {
    return redirect('/auth');
  }

  const queue: Queue = session.get('queue') ?? [];

  if (queue.length === 0) {
    return null;
  }

  const client = clientFactory(session);

  const release = await client.getRelease(queue[0].id);

  return filterVideos(release);
};

export default function Route() {
  const release = useLoaderData<Release | null>();

  const item =
    release !== null
      ? {
          id: release.id,
          artists: formatReleaseArtists(release.artists),
          title: release.title,
          src: primaryOrFirstImage(release.images)?.uri,
        }
      : null;

  return (
    <div className="bg-neutral-50 flex flex-col h-screen text-neutral-900">
      <div className="flex-1 flex overflow-y-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          {/* <TopBar left="Left" right="Right" /> */}
          <Outlet />
        </div>
      </div>
      <BottomBar item={item} videos={release?.videos} />
    </div>
  );
}
