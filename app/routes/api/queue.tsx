import { Tab } from "@headlessui/react";
import { PauseIcon, PlayIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import Button from "~/components/Button";
import IconButton from "~/components/IconButton";
import Page from "~/components/Page";
import QueueItemCard from "~/components/QueueItemCard";
import TopBar from "~/components/TopBar";
import { usePlayer } from "~/contexts/PlayerContext";
import { useQueue } from "~/contexts/QueueContext";

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
            <Tab
              className={({ selected }) =>
                clsx(
                  "decoration-2 underline-offset-2",
                  "focus:outline-none focus:decoration-neutral-400 focus:text-neutral-400",
                  "hover:decoration-neutral-400 hover:text-neutral-400",
                  selected && "underline"
                )
              }
            >
              Queue
            </Tab>
            <Tab
              className={({ selected }) =>
                clsx(
                  "decoration-2 underline-offset-2",
                  "focus:outline-none focus:decoration-neutral-400 focus:text-neutral-400",
                  "hover:decoration-neutral-400 hover:text-neutral-400",
                  selected && "underline"
                )
              }
            >
              History
            </Tab>
          </Tab.List>
        }
        right={<Button onClick={handleClear}>Clear</Button>}
      />
      <Page>
        <Tab.Panels>
          <Tab.Panel className="focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-4 rounded-sm">
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
                          <IconButton
                            aria-label={playing ? "Pause video" : "Play video"}
                            className="p-0"
                            disabled={isPlayPauseDisabled}
                            onClick={handlePlayPause}
                            title={playing ? "Pause video" : "Play video"}
                          >
                            {playing ? (
                              <PauseIcon className="h-6 w-6" />
                            ) : (
                              <PlayIcon className="h-6 w-6" />
                            )}
                          </IconButton>
                        }
                      />
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-neutral-500 text-sm">
                    Next
                  </h3>
                  <ul>
                    {queue.slice(1).map((item, index) => (
                      <li className="mb-2" key={item.id}>
                        <QueueItemCard
                          item={item}
                          left={
                            <div className="text-center text-md w-6">
                              {index + 1}
                            </div>
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : null}
          </Tab.Panel>
          <Tab.Panel className="focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-4">
            <ul>
              {[...history].reverse().map((item) => (
                <li className="mb-2" key={item.id}>
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
