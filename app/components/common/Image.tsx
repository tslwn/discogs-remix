import { PhotographIcon } from "@heroicons/react/solid";

interface ImageProps {
  alt: string;
  src?: string;
}

export default function Image({ alt, src }: ImageProps) {
  return (
    <div className="shrink-0 mr-4 overflow-hidden rounded">
      {src !== undefined ? (
        <img alt={alt} className="h-56 min-w-56 w-56" src={src}></img>
      ) : (
        <div className="bg-neutral-200 flex h-56 items-center justify-center w-56">
          <PhotographIcon className="text-neutral-500 h-5 w-5" />
        </div>
      )}
    </div>
  );
}
