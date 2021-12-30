import React from 'react';
import useEventListener from './useEventListener';

interface Size {
  height: number;
  width: number;
}

export default function useElementSize<T extends HTMLElement>(): [
  (ref: T | null) => void,
  Size
] {
  const [ref, setRef] = React.useState<T | null>(null);

  const [size, setSize] = React.useState<Size>({
    height: 0,
    width: 0,
  });

  const handleResize = React.useCallback(() => {
    setSize({
      height: ref?.offsetHeight || 0,
      width: ref?.offsetWidth || 0,
    });
  }, [ref?.offsetHeight, ref?.offsetWidth]);

  useEventListener('resize', handleResize);

  React.useEffect(() => {
    handleResize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.offsetHeight, ref?.offsetWidth]);

  return [setRef, size];
}
