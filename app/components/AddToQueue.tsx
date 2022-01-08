import { PlusSmIcon } from '@heroicons/react/solid';
import { useQueue } from '~/contexts/QueueContext';
import { encodeItem } from '~/lib/queue';
import { QueueItem } from '~/types/queue';

interface QueueAddProps {
  icon?: boolean;
  item: QueueItem;
  text?: boolean;
}

export default function AddToQueue({ icon, item, text }: QueueAddProps) {
  const { setQueue } = useQueue();

  const handleClick = () => {
    setQueue((prev) => [...prev, encodeItem(item)]);
  };

  return (
    <button
      className="flex hover:underline item-center space-x-2"
      onClick={handleClick}
    >
      {text === true ? <span>Add to queue</span> : null}
      {icon === true ? <PlusSmIcon className="h-5 w-5" /> : null}
    </button>
  );
}
