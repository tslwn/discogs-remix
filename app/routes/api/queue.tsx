import { Tab } from '@headlessui/react';
import { PauseIcon, PlayIcon } from '@heroicons/react/solid';
import Button from '~/components/Button';
import Page from '~/components/Page';
import QueueItemCard from '~/components/QueueItemCard';
import TopBar from '~/components/TopBar';
import { usePlayer } from '~/contexts/PlayerContext';
import { useQueue } from '~/contexts/QueueContext';

export default function Route() {
  const { queue, history, current, clear } = useQueue();

  const nowPlaying = current();

  const handleClear = () => {
    clear();
  };

  const { handlePlayPause, isPlayPauseDisabled, playing } = usePlayer();

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
              <Button onClick={handleClear}>Clear</Button>
            </div>
            {nowPlaying !== undefined ? (
              <>
                <div className="mb-12">
                  <h3 className="font-semibold mb-4 text-neutral-500 text-sm">
                    Now playing
                  </h3>
                  <ul>
                    <li className="mb-2" key={nowPlaying.id}>
                      <QueueItemCard
                        item={nowPlaying}
                        left={
                          <Button
                            aria-label={playing ? 'Pause video' : 'Play video'}
                            disabled={isPlayPauseDisabled}
                            onClick={handlePlayPause}
                            title={playing ? 'Pause video' : 'Play video'}
                          >
                            {playing ? (
                              <PauseIcon className="h-5 w-5" />
                            ) : (
                              <PlayIcon className="h-5 w-5" />
                            )}
                          </Button>
                        }
                      />
                    </li>
                  </ul>{' '}
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-neutral-500 text-sm">
                    Next
                  </h3>
                  <ul>
                    {queue.slice(1).map((item, index) => (
                      <li className="mb-2" key={index}>
                        <QueueItemCard
                          item={item}
                          left={<div className="text-md w-5">{index + 1}</div>}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : null}
          </Tab.Panel>
          <Tab.Panel>
            <div className="mb-4 flex">
              <h2 className="text-xl">History</h2>
            </div>
            <ul>
              {history.map((item, index) => (
                <li className="mb-2" key={index}>
                  <QueueItemCard item={item} />
                </li>
              ))}
            </ul>
          </Tab.Panel>
        </Tab.Panels>
      </Page>
    </Tab.Group>
  );
}
