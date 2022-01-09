import clsx from 'clsx';
import { Link as RemixLink } from 'remix';
import type { LinkProps as RemixLinkProps } from 'remix';

export default function LinkButton({
  children,
  className,
  ...props
}: RemixLinkProps) {
  return (
    <RemixLink
      prefetch="intent"
      {...props}
      className={clsx(
        'bg-neutral-800 hover:bg-neutral-600',
        'focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2',
        'text-white font-semibold',
        'py-2 px-6 rounded-lg',
        className
      )}
    >
      {children}
    </RemixLink>
  );
}
