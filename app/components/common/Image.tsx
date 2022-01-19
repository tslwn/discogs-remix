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
  return (
    <div
      className={clsx("max-w-56 overflow-hidden rounded shrink-0", className)}
    >
      {src !== undefined ? (
        <img
          alt={alt}
          className={sizeClassName({ size, square, src })}
          src={src}
        ></img>
      ) : (
        <div
          className={clsx(
            "bg-neutral-200 flex items-center justify-center",
            sizeClassName({ size, square, src })
          )}
        >
          <PhotographIcon className="text-neutral-500 h-5 w-5" />
        </div>
      )}
    </div>
  );
}

function sizeClassName({
  size,
  square,
  src,
}: Pick<ImageProps, "size" | "square" | "src">) {
  if (square === true || src === undefined) {
    return size === 14 ? "h-14 w-14" : "h-56 w-56";
  }
  return undefined;
}
