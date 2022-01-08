import React from 'react';
import { Tab } from '@headlessui/react';
import Button from '~/components/Button';
import Page from '~/components/Page';
import QueueItemCard from '~/components/QueueItemCard';
import TopBar from '~/components/TopBar';
import { useQueue } from '~/contexts/QueueContext';
import { decodeItem } from '~/lib/queue';

export default function Route() {
  const { queue, history, clear } = useQueue();

  const handleClear = () => {
    clear();
  };

  return (
    <Tab.Group manual>
      <TopBar
        left={
          <Tab.List className="space-x-4">
            <Tab className={({ selected }) => (selected ? 'underline' : '')}>
              Queue
            </Tab>
            <Tab className={({ selected }) => (selected ? 'underline' : '')}>
              History
            </Tab>
          </Tab.List>
        }
      />
      <Page>
        <Tab.Panels>
          <Tab.Panel>
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
          </Tab.Panel>
          <Tab.Panel>
            <div className="mb-4 flex">
              <h2 className="text-xl">History</h2>
            </div>
            <ul>
              {history.map((item, index) => (
                <li className="mb-2" key={index}>
                  <QueueItemCard
                    item={decodeItem(item)}
                    left={<div className="text-md w-3">{index + 1}</div>}
                  />
                </li>
              ))}
            </ul>
          </Tab.Panel>
        </Tab.Panels>
      </Page>
    </Tab.Group>
  );
}
