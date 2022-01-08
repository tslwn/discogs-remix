import { PlusSmIcon } from '@heroicons/react/solid';
import { useFetcher } from 'remix';
import { QueueItem } from '~/types/queue';

interface QueueAddProps {
  icon?: boolean;
  item: QueueItem;
  text?: boolean;
}

export default function QueueAddForm({ icon, item, text }: QueueAddProps) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form action="/api/queue/add" method="post">
      <input hidden id="id" name="id" readOnly value={item.id} />
      <input hidden id="artists" name="artists" readOnly value={item.artists} />
      <input hidden id="title" name="title" readOnly value={item.title} />
      <input hidden id="src" name="src" readOnly value={item.src} />
      <button
        className="flex hover:underline item-center space-x-2"
        disabled={fetcher.state === 'submitting'}
      >
        {text === true ? <span>Add to queue</span> : null}
        {icon === true ? <PlusSmIcon className="h-5 w-5" /> : null}
      </button>
    </fetcher.Form>
  );
}
