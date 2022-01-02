import React from 'react';

interface IconProps {
  className?: string;
  d: string;
}

function Icon({ className, d }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path fillRule="evenodd" d={d} clipRule="evenodd" />
    </svg>
  );
}

type SpecificIconProps = Omit<IconProps, 'd'>;

export const ArrowLeftIcon = ({ className }: SpecificIconProps) => (
  <Icon
    className={className}
    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
  />
);

export const ArrowRightIcon = ({ className }: SpecificIconProps) => (
  <Icon
    className={className}
    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
  />
);

export const ChevronDownIcon = ({ className }: SpecificIconProps) => (
  <Icon
    className={className}
    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
  />
);

export const ChevronUpIcon = ({ className }: SpecificIconProps) => (
  <Icon
    className={className}
    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
  />
);

export const PauseIcon = ({ className }: SpecificIconProps) => (
  <Icon
    className={className}
    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
  />
);

export const PlayIcon = ({ className }: SpecificIconProps) => (
  <Icon
    className={className}
    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
  />
);
