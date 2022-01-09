import { MusicNoteIcon } from '@heroicons/react/solid';
import React from 'react';
import Link from '~/components/Link';

type ItemCardProps = {
  title: string | { text: string; to: string };
  subtitle: string | { text: string; to: string };
  image: {
    alt: string;
    src?: string;
  };
  left?: React.ReactNode;
  right?: React.ReactNode;
  // If true, conventional styles are applied to the links.
  visited?: boolean;
};

export default function ItemCard({
  title,
  subtitle,
  image,
  left,
  right,
  visited,
}: ItemCardProps) {
  return (
    <div className="flex items-center">
      {left !== undefined ? <div className="mr-4">{left}</div> : null}
      <div className="h-14 mr-4 overflow-hidden w-14">
        {image.src !== undefined ? (
          <img alt={image.alt} src={image.src}></img>
        ) : (
          <div className="bg-neutral-200 flex h-full items-center justify-center">
            <MusicNoteIcon className="text-neutral-500 h-5 w-5" />
          </div>
        )}
      </div>
      <div>
        <div>
          {typeof title === 'string' || title === undefined ? (
            <span>{title}</span>
          ) : (
            <Link to={title.to} visited={visited}>
              {title.text}
            </Link>
          )}
        </div>
        <div className="text-xs">
          {typeof subtitle === 'string' || subtitle === undefined ? (
            <span>{subtitle}</span>
          ) : (
            <Link to={subtitle.to} visited={visited}>
              {subtitle.text}
            </Link>
          )}
        </div>
      </div>
      {right !== undefined ? <div className="ml-4">{right}</div> : null}
    </div>
  );
}
