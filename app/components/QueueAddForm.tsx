import { PlusSmIcon } from '@heroicons/react/solid';
import { useFetcher } from 'remix';
import { QueueItem } from '~/types/queue';

interface QueueAddProps {
  item: QueueItem;
  text?: boolean;
}

export default function QueueAddForm({ item, text }: QueueAddProps) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form action="/api/queue/add" className="inline" method="post">
      <input hidden id="id" name="id" readOnly value={item.id} />
      <input hidden id="artists" name="artists" readOnly value={item.artists} />
      <input hidden id="title" name="title" readOnly value={item.title} />
      <input hidden id="src" name="src" readOnly value={item.src} />
      <button
        className="flex hover:underline item-center"
        disabled={fetcher.state === 'submitting'}
      >
        {text === true ? <span className="mr-1">Add to queue</span> : null}
        <PlusSmIcon className="h-5 w-5" />
      </button>
    </fetcher.Form>
  );
}
