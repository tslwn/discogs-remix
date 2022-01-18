import { PhotographIcon } from "@heroicons/react/solid";
import clsx from "clsx";

export interface ImageProps {
  alt: string;
  className?: string;
  size: 14 | 56;
  square?: boolean;
  src?: string;
}

export default function Image({
  alt,
  className,
  size,
  square = true,
  src,
}: ImageProps) {
  const heightClassName = size === 14 ? "h-14" : "h-56";
  const widthClassName = square ? (size === 14 ? "w-14" : "w-56") : undefined;

  return (
    <div className={clsx("overflow-hidden rounded shrink-0", className)}>
      {src !== undefined ? (
        <img
          alt={alt}
          className={clsx(heightClassName, widthClassName)}
          src={src}
        ></img>
      ) : (
        <div
          className={clsx(
            "bg-neutral-200 flex items-center justify-center",
            heightClassName,
            widthClassName
          )}
        >
          <PhotographIcon className="text-neutral-500 h-5 w-5" />
        </div>
      )}
    </div>
  );
}
