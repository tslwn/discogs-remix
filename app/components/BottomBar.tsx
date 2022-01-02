import { Link } from 'remix';
import type { QueueItem } from '~/types/queue';
import QueueItemCard from './QueueItemCard';

type BottomBarProps = {
  item: QueueItem | null;
};

export default function BottomBar({ item }: BottomBarProps) {
  return (
    <div className="border-t flex flex-none h-20 items-center justify-between px-4">
      {item !== null ? (
        <QueueItemCard item={item} />
      ) : (
        <div className="flex items-center">No releases in queue.</div>
      )}
      <div className="flex flex-col justify-center">
        <div className="flex justify-center">Player controls</div>
      </div>
      <div className="flex items-center">
        <Link className="hover:underline" to="/api/queue">
          Queue
        </Link>
      </div>
    </div>
  );
}
