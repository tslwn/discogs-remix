import { ClientOnly } from 'remix-utils';
import Link from '~/components/Link';
import QueueItemCard from '~/components/QueueItemCard';
import YouTubePlayer from '~/components/YouTubePlayer';
import type { Release } from '~/types/discojs';
import type { QueueItem } from '~/types/queue';

type BottomBarProps = {
  item: QueueItem | null;
  videos: Release['videos'];
};

export default function BottomBar({ item, videos }: BottomBarProps) {
  return (
    <div className="border-t flex flex-none h-24 items-center justify-between px-4">
      {item !== null ? (
        <QueueItemCard item={item} />
      ) : (
        <div className="flex items-center">No releases in queue.</div>
      )}
      <ClientOnly>
        {videos !== undefined ? <YouTubePlayer videos={videos} /> : null}
      </ClientOnly>
      <div className="flex items-center">
        <Link to="/api/queue">Queue</Link>
      </div>
    </div>
  );
}
