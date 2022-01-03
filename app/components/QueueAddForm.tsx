import { PlusSmIcon } from '@heroicons/react/solid';
import { useFetcher } from 'remix';
import { QueueItem } from '~/types/queue';

interface QueueAddProps {
  item: QueueItem;
  text?: boolean;
}

export default function QueueAddForm({ item, text }: QueueAddProps) {
  const form = {
    id: `${item.id}-id`,
    artists: `${item.id}-artists`,
    title: `${item.id}-title`,
    src: `${item.id}-src`,
  };

  const fetcher = useFetcher();

  return (
    <fetcher.Form action="/api/queue/add" className="inline" method="post">
      <input hidden id={form.id} name={form.id} readOnly value={item.id} />
      <input
        hidden
        id={form.artists}
        name={form.artists}
        readOnly
        value={item.artists}
      />
      <input
        hidden
        id={form.title}
        name={form.title}
        readOnly
        value={item.title}
      />
      <input hidden id={form.src} name={form.src} readOnly value={item.src} />
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
