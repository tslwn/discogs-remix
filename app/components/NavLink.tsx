import clsx from "clsx";
import { NavLink as RemixNavLink } from "remix";
import type { NavLinkProps as RemixNavLinkProps } from "remix";

type NavLinkProps = RemixNavLinkProps & {};

export default function Link({ children, className, ...props }: NavLinkProps) {
  return (
    <RemixNavLink
      prefetch="intent"
      {...props}
      className={({ isActive }) =>
        clsx(
          "decoration-2 underline-offset-2",
          "focus:outline-none focus:underline hover:underline",
          isActive && "underline",
          className
        )
      }
    >
      {children}
    </RemixNavLink>
  );
}
