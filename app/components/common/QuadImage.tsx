import clsx from "clsx";
import { QueueItem } from "~/types/queue";

export interface QuadImageProps {
  className?: string;
  items: QueueItem[];
}

export default function QuadImage({ className, items }: QuadImageProps) {
  return (
    <div className={clsx("overflow-hidden rounded shrink-0", className)}>
      <div className="flex">
        <img alt="" className="h-28 w-28" src={items[0]?.src}></img>
        <img alt="" className="h-28 w-28" src={items[1]?.src}></img>
      </div>
      <div className="flex">
        <img alt="" className="h-28 w-28" src={items[2]?.src}></img>
        <img alt="" className="h-28 w-28" src={items[3]?.src}></img>
      </div>
    </div>
  );
}
