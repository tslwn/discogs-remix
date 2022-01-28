import clsx from "clsx";
import React from "react";
import Image from "~/components/common/Image";
import type { ImageProps } from "~/components/common/Image";
import Link from "~/components/common/Link";
import type { LinkProps } from "~/components/common/Link";

type ImageListItemProps = {
  imageProps: Omit<ImageProps, "size">;
  linkProps: LinkProps;
  subtitle: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  textWidth?: 64;
};

export default function ImageListItem({
  imageProps,
  linkProps,
  subtitle,
  left,
  right,
  textWidth,
}: ImageListItemProps) {
  return (
    <div className="flex items-center">
      {left !== undefined ? left : null}
      <Image
        {...imageProps}
        className={clsx("mr-4", imageProps.className)}
        size={14}
      />
      <div className={clsx("mr-4", textWidth && "max-w-64")}>
        <Link
          {...linkProps}
          className={clsx("block truncate", linkProps.className)}
        >
          {linkProps.children}
        </Link>
        <span className="block text-xs truncate">{subtitle}</span>
      </div>
      {right !== undefined ? right : null}
    </div>
  );
}
