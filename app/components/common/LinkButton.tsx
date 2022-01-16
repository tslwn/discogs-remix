import clsx from "clsx";
import { Link as RemixLink } from "remix";
import type { LinkProps as RemixLinkProps } from "remix";

export default function LinkButton({
  children,
  className,
  ...props
}: RemixLinkProps) {
  return (
    <RemixLink
      // TODO: "Too Many Requests"
      prefetch="intent"
      {...props}
      className={clsx(
        "bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 font-semibold hover:bg-neutral-600 py-2 px-6 rounded-lg text-white",
        className
      )}
    >
      {children}
    </RemixLink>
  );
}
