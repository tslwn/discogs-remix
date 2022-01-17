import { PhotographIcon } from "@heroicons/react/solid";
import clsx from "clsx";

export interface ImageProps {
  alt: string;
  className?: string;
  size: 14 | 56;
  src?: string;
}

export default function Image({ alt, className, size, src }: ImageProps) {
  const sizeClassName = size === 14 ? "h-14 w-14" : "h-56 w-56";

  return (
    <div className={clsx("overflow-hidden rounded shrink-0", className)}>
      {src !== undefined ? (
        <img alt={alt} className={sizeClassName} src={src}></img>
      ) : (
        <div
          className={clsx(
            "bg-neutral-200 flex items-center justify-center",
            sizeClassName
          )}
        >
          <PhotographIcon className="text-neutral-500 h-5 w-5" />
        </div>
      )}
    </div>
  );
}
