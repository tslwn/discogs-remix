import { useFetcher } from 'remix';
import { ClientOnly } from 'remix-utils';
import { HeartIcon } from '@heroicons/react/solid';
import Button from '~/components/Button';
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
  const wantlistFetcher = useFetcher();

  const queueNextFetcher = useFetcher();

  return (
    <div className="border-t flex flex-none h-24 items-center justify-between px-4">
      {item !== null ? (
        <QueueItemCard
          item={item}
          right={
            <wantlistFetcher.Form action="/api/wantlist" method="post">
              <input hidden id="id" name="id" readOnly value={item.id} />
              <Button
                aria-label="Add to wantlist"
                className="mr-2"
                disabled={wantlistFetcher.state === 'submitting'}
                title="Add to wantlist"
              >
                <HeartIcon className="h-5 w-5" />
              </Button>
            </wantlistFetcher.Form>
          }
        />
      ) : (
        <div className="flex items-center">No releases in queue</div>
      )}
      <ClientOnly>
        {videos !== undefined ? <YouTubePlayer videos={videos} /> : null}
      </ClientOnly>
      <div className="flex items-center">
        <queueNextFetcher.Form action="/api/queue/next" method="post">
          <button
            className="hover:underline mr-4"
            disabled={queueNextFetcher.state === 'submitting'}
          >
            Next
          </button>
        </queueNextFetcher.Form>
        <Link prefetch="none" to="/api/queue">
          Queue
        </Link>
      </div>
    </div>
  );
}
