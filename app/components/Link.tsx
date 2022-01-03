import clsx from 'clsx';
import { Link as RemixLink } from 'remix';
import type { LinkProps as RemixLinkProps } from 'remix';

export default function Link({ children, ...props }: RemixLinkProps) {
  return (
    <RemixLink
      prefetch="intent"
      {...props}
      className={clsx('hover:underline', props.className)}
    >
      {children}
    </RemixLink>
  );
}
