import { Tab } from "@headlessui/react";
import { PauseIcon, PlayIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import React from "react";
import QueueListItem from "~/components/QueueListItem";
import Button from "~/components/common/Button";
import IconButton from "~/components/common/IconButton";
import Page from "~/components/common/Page";
import { usePlayer } from "~/contexts/PlayerContext";
import { useQueue } from "~/contexts/QueueContext";

export const meta = () => ({
  title: "Queue",
});

export default function Route() {
  const { queue, history, current, clear } = useQueue();

  const nowPlaying = current();

  const handleClear = () => {
    clear();
  };

  const { handlePlayPause, isPlayPauseDisabled, playing } = usePlayer();

  return (
    <Page>
      <Tab.Group manual>
        <div className="flex items-center mb-6 justify-between">
          <Tab.List className="space-x-4">
            <QueueTab>Queue</QueueTab>
            <QueueTab>History</QueueTab>
          </Tab.List>

          <Button onClick={handleClear}>Clear</Button>
        </div>
        <Tab.Panels>
          <Tab.Panel className="focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-4 rounded-sm">
            {nowPlaying !== undefined ? (
              <>
                <div className="mb-12">
                  <h3 className="font-semibold mb-4 text-neutral-500 text-sm">
                    Now playing
                  </h3>
                  <ul>
                    <li key={nowPlaying.id}>
                      <QueueListItem
                        item={nowPlaying}
                        left={
                          <IconButton
                            aria-label={playing ? "Pause video" : "Play video"}
                            className="p-0 w-10"
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
                  <ul className="space-y-2">
                    {queue.slice(1).map((item, index) => (
                      <li key={item.id}>
                        <QueueListItem
                          item={item}
                          left={
                            <div className="text-center text-md w-10">
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
            <ul className="space-y-2">
              {[...history].reverse().map((item, index) => (
                <li key={index}>
                  <QueueListItem item={item} />
                </li>
              ))}
            </ul>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Page>
  );
}

function QueueTab({ children }: React.PropsWithChildren<{}>) {
  return (
    <Tab
      className={({ selected }) =>
        clsx(
          "decoration-2 focus:outline-none focus:decoration-neutral-400 focus:text-neutral-400 hover:decoration-neutral-400 hover:text-neutral-400 underline-offset-2",
          selected && "underline"
        )
      }
    >
      {children}
    </Tab>
  );
}
