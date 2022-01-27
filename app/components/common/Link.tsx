import clsx from "clsx";
import { Link as RemixLink } from "remix";
import type { LinkProps as RemixLinkProps } from "remix";

export type LinkProps = RemixLinkProps & {
  // If false, conventional styles are not applied to the link.
  visited?: boolean;
};

export default function Link({
  children,
  className,
  visited,
  ...props
}: LinkProps) {
  return (
    <RemixLink
      // TODO: "Too Many Requests"
      prefetch="intent"
      {...props}
      className={clsx(
        "decoration-2 focus:outline-none focus:underline hover:underline underline-offset-2",
        visited !== false && "text-blue-600 visited:text-fuchsia-600",
        className
      )}
    >
      {children}
    </RemixLink>
  );
}
