import clsx from 'clsx';
import React from 'react';
import Icon, { IconName } from './Icon';

type IconButtonProps = {
  iconProps: {
    className?: string;
    icon: keyof typeof IconName;
  };
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function IconButton({ iconProps, ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      className={clsx(props.className, props.disabled && 'cursor-not-allowed')}
    >
      <Icon
        className={clsx(
          iconProps.className,
          'hover:fill-gray-400',
          props.disabled && 'fill-gray-400'
        )}
        icon={iconProps.icon}
      />
    </button>
  );
}
