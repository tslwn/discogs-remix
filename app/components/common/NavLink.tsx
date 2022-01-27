import clsx from "clsx";
import { NavLink as RemixNavLink } from "remix";
import type { NavLinkProps as RemixNavLinkProps } from "remix";

type NavLinkProps = RemixNavLinkProps & {
  // If false, conventional styles are not applied to the link.
  visited?: boolean;
};

export default function Link({
  children,
  className,
  visited,
  ...props
}: NavLinkProps) {
  return (
    <RemixNavLink
      // TODO: "Too Many Requests"
      prefetch="intent"
      {...props}
      className={({ isActive }) =>
        clsx(
          "decoration-2 focus:outline-none focus:underline hover:underline underline-offset-2",
          isActive && "underline",
          visited !== false && "text-blue-600 visited:text-fuchsia-600",
          className
        )
      }
    >
      {children}
    </RemixNavLink>
  );
}
