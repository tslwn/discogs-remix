import React from 'react';
import { Link } from 'remix';

type ItemCardProps = {
  title: string | { text: string; to: string };
  subtitle: string | { text: string; to: string };
  image: {
    alt: string;
    src?: string;
  };
  left?: React.ReactNode;
};

export default function ItemCard({
  image,
  left,
  subtitle,
  title,
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
            <Link className="hover:underline" to={title.to}>
              {title.text}
            </Link>
          )}
        </div>
        <div className="text-xs">
          {typeof subtitle === 'string' || subtitle === undefined ? (
            <span>{subtitle}</span>
          ) : (
            <Link className="hover:underline" to={subtitle.to}>
              {subtitle.text}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
