import * as React from 'react';
import { Link } from 'remix';

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  variant?: 'primary' | 'secondary';
};

export default function ButtonLink({
  children,
  className,
  variant = 'primary',
  ...props
}: React.PropsWithChildren<ButtonLinkProps>) {
  const variantClassName = 'primary'
    ? 'bg-black font-bold hover:bg-gray-800 px-3 py-2 rounded text-sm text-white transition-colors'
    : 'border-2 border-gray-200 font-bold hover:bg-gray-200 px-3 py-2 rounded text-sm transition-colors';

  return (
    <Link
      className={
        variantClassName + (className !== undefined ? ' ' + className : '')
      }
      {...props}
    >
      {children}
    </Link>
  );
}
