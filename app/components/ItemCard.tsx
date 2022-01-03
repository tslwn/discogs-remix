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
};

export default function ItemCard({
  title,
  subtitle,
  image,
  left,
  right,
}: ItemCardProps) {
  return (
    <div className="flex items-center">
      {left !== undefined ? <div className="mr-4">{left}</div> : null}
      {image.src !== undefined ? (
        <img alt={image.alt} className="h-14 w-14 mr-4" src={image.src}></img>
      ) : null}
      <div>
        <div>
          {typeof title === 'string' || title === undefined ? (
            <span>{title}</span>
          ) : (
            <Link to={title.to}>{title.text}</Link>
          )}
        </div>
        <div className="text-xs">
          {typeof subtitle === 'string' || subtitle === undefined ? (
            <span>{subtitle}</span>
          ) : (
            <Link to={subtitle.to}>{subtitle.text}</Link>
          )}
        </div>
      </div>
      {right !== undefined ? <div className="ml-4">{right}</div> : null}
    </div>
  );
}
