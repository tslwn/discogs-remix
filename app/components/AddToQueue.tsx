import { PlusSmIcon } from '@heroicons/react/solid';
import Button from '~/components/Button';
import { useQueue } from '~/contexts/QueueContext';
import { encodeItem } from '~/lib/queue';
import { QueueItem } from '~/types/queue';

interface QueueAddProps {
  icon?: boolean;
  item: QueueItem;
  text?: boolean;
}

export default function AddToQueue({ icon, item, text }: QueueAddProps) {
  const { queue, setQueue } = useQueue();

  const isDisabled = queue.findIndex(({ id }) => item.id === id) > -1;

  const handleClick = () => {
    setQueue((prev) => [...prev, encodeItem(item)]);
  };

  return (
    <Button
      className="flex item-center space-x-2"
      disabled={isDisabled}
      onClick={handleClick}
    >
      {text === true ? <span>Add to queue</span> : null}
      {icon === true ? <PlusSmIcon className="h-5 w-5" /> : null}
    </Button>
  );
}
