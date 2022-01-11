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
      prefetch="intent"
      {...props}
      className={clsx(
        visited && "text-blue-600 visited:text-fuchsia-600",
        "decoration-2 underline-offset-2",
        "focus:outline-none focus:underline hover:underline",
        className
      )}
    >
      {children}
    </RemixLink>
  );
}
