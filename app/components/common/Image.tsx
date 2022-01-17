import { PhotographIcon } from "@heroicons/react/solid";
import clsx from "clsx";

export interface ImageProps {
  alt: string;
  className?: string;
  size: 14 | 56;
  src?: string;
}

export default function Image({ alt, className, size, src }: ImageProps) {
  return (
    <div className={clsx("shrink-0 overflow-hidden rounded", className)}>
      {src !== undefined ? (
        <img alt={alt} className={`h-${size} w-${size}`} src={src}></img>
      ) : (
        <div
          className={`bg-neutral-200 flex h-${size} items-center justify-center w-${size}`}
        >
          <PhotographIcon className="text-neutral-500 h-5 w-5" />
        </div>
      )}
    </div>
  );
}
