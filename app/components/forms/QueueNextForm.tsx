import { useFetcher } from 'remix';
import Button from '~/components/button';

interface QueueNextFormProps {
  className?: string;
}

export default function QueueNextForm({ className }: QueueNextFormProps) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form action="/api/queue/next" className={className} method="post">
      <Button disabled={fetcher.state === 'submitting'}>Next</Button>
    </fetcher.Form>
  );
}
