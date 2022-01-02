import React from 'react';
import type { QueueItem } from '~/types/queue';
import ItemCard from './ItemCard';

type QueueItemCardProps = {
  item: QueueItem;
  left?: React.ReactNode;
};

export default function QueueItemCard({ item, left }: QueueItemCardProps) {
  return (
    <ItemCard
      title={{ text: item.title, to: `/api/releases/${item.id}` }}
      subtitle={item.artists}
      image={{ alt: `${item.artists} - ${item.title}`, src: item.src }}
      left={left}
    />
  );
}
