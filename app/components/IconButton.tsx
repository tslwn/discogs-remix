import clsx from 'clsx';
import React from 'react';

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function IconButton({ children, ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        !props.disabled && 'hover:text-neutral-600',
        'focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2',
        'p-1 rounded-full',
        props.className,
        props.disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      {children}
    </button>
  );
}
