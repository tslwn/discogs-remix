import clsx from 'clsx';
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function IconButton({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        props.className,
        'hover:underline',
        props.disabled && 'cursor-not-allowed text-neutral-400'
      )}
    >
      {children}
    </button>
  );
}
