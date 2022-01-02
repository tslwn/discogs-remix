import React from 'react';
import { Link } from 'remix';
import { QueueItem } from '~/types/queue';

type NowPlayingProps = {
  item: QueueItem;
  left?: React.ReactNode;
};

export default function NowPlaying({ item, left }: NowPlayingProps) {
  return (
    <div className="flex items-center">
      {left !== undefined ? <div className="mr-4">{left}</div> : null}
      {item.src !== undefined ? (
        <img
          alt={`${item.artists} - ${item.title}`}
          className="h-14 w-14 mr-4"
          src={item.src}
        ></img>
      ) : null}
      <div>
        <Link className="block hover:underline" to={`/api/releases/${item.id}`}>
          {item.title}
        </Link>
        <span className="block text-xs">{item.artists}</span>
      </div>
    </div>
  );
}
