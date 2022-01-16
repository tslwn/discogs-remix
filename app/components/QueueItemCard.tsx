import React from "react";
import type { QueueItem } from "~/types/queue";
import ItemCard from "./ItemCard";

type QueueItemCardProps = {
  className?: string;
  item: QueueItem;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export default function QueueItemCard({
  className,
  item,
  left,
  right,
}: QueueItemCardProps) {
  return (
    <ItemCard
      className={className}
      title={{ text: item.title, to: `/api/${item.type}s/${item.id}` }}
      subtitle={item.artists}
      image={{ alt: `${item.artists} - ${item.title}`, src: item.src }}
      left={left}
      right={right}
    />
  );
}
