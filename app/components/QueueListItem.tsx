import React from "react";
import ImageListItem from "~/components/common/ImageListItem";
import type { QueueItem } from "~/types/queue";
import { getResourceUrl } from "~/util/release";

type QueueListItemProps = {
  item: QueueItem;
  left?: React.ReactNode;
  right?: React.ReactNode;
  textWidth?: 64;
};

export default function QueueListItem({
  item,
  left,
  right,
  textWidth,
}: QueueListItemProps) {
  return (
    <ImageListItem
      imageProps={{
        alt: item.artists + " - " + item.title,
        src: item.src,
      }}
      linkProps={{
        children: item.artists,
        to: getResourceUrl(item),
      }}
      subtitle={item.title}
      left={left}
      right={right}
      textWidth={textWidth}
    />
  );
}
