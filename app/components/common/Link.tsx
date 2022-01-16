import clsx from "clsx";
import { Link as RemixLink } from "remix";
import type { LinkProps as RemixLinkProps } from "remix";

type LinkProps = RemixLinkProps & {
  // If true, conventional styles are applied to the link.
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
        visited && "text-blue-600 visited:text-fuchsia-600",
        className
      )}
    >
      {children}
    </RemixLink>
  );
}
