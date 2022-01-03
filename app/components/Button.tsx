import clsx from 'clsx';
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function IconButton({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        props.className,
        props.disabled && 'cursor-not-allowed text-gray-400'
      )}
    >
      {children}
    </button>
  );
}
