import clsx from "clsx";
import React from "react";
import { useQueue } from "~/contexts/QueueContext";
import useIsHydrated from "~/hooks/useIsHydrated";
import type { Release } from "~/util/discogs";
import { releaseToItem } from "~/util/queue";

interface VideosProps {
  release: Release;
}

export default function Videos({ release }: VideosProps) {
  const count = release.videos?.length ?? 0;

  const { queue, enqueue } = useQueue();

  const isInQueue = queue.find((item) => item.id === release.id) !== undefined;

  const isDisabled = count === 0 || isInQueue;

  const handleClick = () => {
    enqueue(releaseToItem(release));
  };

  const isHydrated = useIsHydrated();

  return (
    <button
      className={clsx(
        "flex flex-col focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 px-4 py-2 rounded",
        isDisabled ? "cursor-not-allowed" : "hover:bg-neutral-100"
      )}
      disabled={isDisabled}
      onClick={handleClick}
      type="button"
    >
      {isHydrated ? (
        <span
          className={clsx(
            "font-semibold text-2xl",
            isInQueue && "text-neutral-500"
          )}
        >
          {isInQueue ? "In queue" : "Add to queue"}
        </span>
      ) : (
        <div className="animate-pulse bg-neutral-100 h-8 rounded w-36"></div>
      )}
      <span className="text-neutral-500">
        {count > 0 ? count.toLocaleString() : "No"} video
        {count !== 1 ? "s" : ""}
      </span>
    </button>
  );
}
