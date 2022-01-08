import React from 'react';
import { useFetcher } from 'remix';
import Button from '~/components/Button';
import Link from '~/components/Link';
import QueueItemCard from '~/components/QueueItemCard';
import YouTubePlayer from '~/components/YouTubePlayer';
import WantlistForm from '~/components/forms/WantlistForm';
import { useQueue } from '~/contexts/QueueContext';
import type { Release } from '~/types/discojs';
import { decodeItem } from '~/lib/queue';

export default function BottomBar() {
  const { queue, setQueue } = useQueue();

  const item = queue.length > 0 ? decodeItem(queue[0]) : null;

  const fetcher = useFetcher<Release | null>();

  React.useEffect(() => {
    if (item !== null) {
      fetcher.load(`/api/releases/${item.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id]);

  const videos = fetcher.data?.videos;

  const handleNext = () => {
    setQueue((prev) => prev.slice(1));
  };

  return (
    <div className="border-t flex flex-none h-24 items-center justify-between px-4">
      {item !== null ? (
        <QueueItemCard
          item={item}
          right={<WantlistForm className="mr-4" id={item.id} />}
        />
      ) : (
        <div className="flex items-center">No releases in queue</div>
      )}
      {videos !== undefined ? <YouTubePlayer videos={videos} /> : null}
      <div className="flex items-center">
        <Button className="mr-4" onClick={handleNext}>
          Next
        </Button>
        <Link prefetch="none" to="/api/queue">
          Queue
        </Link>
      </div>
    </div>
  );
}
