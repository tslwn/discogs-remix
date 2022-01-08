import Page from '~/components/Page';
import QueueItemCard from '~/components/QueueItemCard';
import { useQueue } from '~/contexts/QueueContext';
import { decodeItem } from '~/lib/queue';

export default function Route() {
  const { queue, setQueue } = useQueue();

  const handleClear = () => {
    setQueue([]);
  };

  return (
    <Page>
      <div className="mb-4 flex justify-between">
        <h2 className="text-xl">Queue</h2>
        <button onClick={handleClear}>Clear</button>
      </div>
      <ul>
        {queue.map((item, index) => (
          <li className="mb-2" key={index}>
            <QueueItemCard
              item={decodeItem(item)}
              left={<div className="text-md w-3">{index + 1}</div>}
            />
          </li>
        ))}
      </ul>
    </Page>
  );
}
