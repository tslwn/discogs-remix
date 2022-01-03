import { useFetcher, useTransition } from 'remix';
import { ClientOnly } from 'remix-utils';
import IconButton from '~/components/IconButton';
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
  const fetcher = useFetcher();

  const transition = useTransition();

  return (
    <div className="border-t flex flex-none h-24 items-center justify-between px-4">
      {item !== null ? (
        <QueueItemCard
          item={item}
          right={
            <IconButton
              aria-label="Add to wantlist"
              className="mr-2"
              iconProps={{
                className: 'h-5 w-5',
                icon: 'Heart',
              }}
              onClick={() => {
                console.log('Add to wantlist', item.id);
              }}
              title="Add to wantlist"
            />
          }
        />
      ) : (
        <div className="flex items-center">No releases in queue.</div>
      )}
      <ClientOnly>
        {videos !== undefined ? <YouTubePlayer videos={videos} /> : null}
      </ClientOnly>
      <div className="flex items-center">
        <fetcher.Form action="/api/queue/next" method="post">
          <button
            className="hover:underline mr-4"
            disabled={transition.state === 'submitting'}
          >
            Next
          </button>
        </fetcher.Form>
        <Link prefetch="none" to="/api/queue">
          Queue
        </Link>
      </div>
    </div>
  );
}
