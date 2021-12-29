import * as React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

function Button({
  children,
  className,
  variant = 'primary',
  ...props
}: React.PropsWithChildren<ButtonProps>): React.ReactElement {
  const variantClassName =
    variant === 'primary'
      ? 'bg-black font-bold hover:bg-gray-800 px-3 py-2 rounded text-sm text-white transition-colors'
      : 'border-2 border-gray-200 font-bold hover:bg-gray-200 px-3 py-2 rounded text-sm transition-colors';

  return (
    <button
      className={
        variantClassName + (className !== undefined ? ' ' + className : '')
      }
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
