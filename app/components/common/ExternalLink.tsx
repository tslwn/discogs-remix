import clsx from "clsx";
import React from "react";

type ExternalLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  // If false, conventional styles are not applied to the link.
  visited?: boolean;
};

export default function ExternalLink({
  children,
  className,
  visited,
  ...props
}: ExternalLinkProps) {
  return (
    <a
      {...props}
      className={clsx(
        "decoration-2 focus:outline-none focus:underline hover:underline underline-offset-2",
        visited !== false && "text-blue-600 visited:text-fuchsia-600",
        className
      )}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}
