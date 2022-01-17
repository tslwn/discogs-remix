import React from "react";
import { useFetcher } from "remix";
import QueueListItem from "~/components/QueueListItem";
import YouTubePlayer from "~/components/YouTubePlayer";
import Button from "~/components/common/Button";
import LinkButton from "~/components/common/LinkButton";
import WantlistForm from "~/components/forms/WantlistForm";
import { usePlayer } from "~/contexts/PlayerContext";
import { useQueue } from "~/contexts/QueueContext";
import type { Release } from "~/types/discojs";
import { getResourceUrl } from "~/util/release";

export default function QueuePlayer() {
  const { handleNext, isNextDisabled, item } = useQueuePlayer();

  return (
    <div className="bg-neutral-100 flex flex-none h-28 items-center justify-between px-4">
      <div className="w-96">
        {item !== null ? (
          <QueueListItem
            item={item}
            right={<WantlistForm id={item.id} />}
            textWidth={64}
          />
        ) : null}
      </div>
      <YouTubePlayer />
      <div className="flex items-center">
        <Button className="mr-4" disabled={isNextDisabled} onClick={handleNext}>
          Next
        </Button>
        <LinkButton prefetch="none" to="/api/queue">
          Queue
        </LinkButton>
      </div>
    </div>
  );
}

function useQueuePlayer() {
  const { queue, dequeue } = useQueue();

  const item = queue.length > 0 ? queue[0] : null;

  const fetcher = useFetcher<{ release: Release } | null>();

  const { setDisabled, setVideos } = usePlayer();

  React.useEffect(() => {
    if (item !== null) {
      fetcher.load(getResourceUrl(item));
    } else {
      setVideos([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id]);

  React.useEffect(() => {
    setDisabled(fetcher.state === "loading");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state]);

  React.useEffect(() => {
    if (fetcher.data) {
      setVideos(fetcher.data.release.videos ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.data]);

  const isNextDisabled = fetcher.state === "loading" || queue.length <= 1;

  const handleNext = () => {
    if (!isNextDisabled) {
      dequeue();
    }
  };

  return { handleNext, isNextDisabled, item };
}
