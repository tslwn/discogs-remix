import clsx from "clsx";
import React from "react";
import Image from "~/components/common/Image";
import Link from "~/components/common/Link";
import type { QueueItem } from "~/types/queue";
import { getItemUrl } from "~/util/queue";

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
    <div className="flex items-center">
      {left !== undefined ? left : null}
      <Image
        alt={item.artists + " - " + item.title}
        className="mr-4"
        size={14}
        src={item.src}
      />
      <div
        className={clsx(
          "mr-4 overflow-hidden whitespace-nowrap",
          textWidth && "w-" + textWidth.toString()
        )}
      >
        <div>
          <Link className="text-ellipsis" to={getItemUrl(item)}>
            {item.artists}
          </Link>
        </div>
        <div className="text-xs">{item.title}</div>
      </div>
      {right !== undefined ? right : null}
    </div>
  );
}
