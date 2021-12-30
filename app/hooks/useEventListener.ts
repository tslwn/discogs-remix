import React from 'react';

export default function useEventListener<T extends HTMLElement>(
  name: keyof WindowEventMap | string,
  handler: (event: Event) => void,
  element?: React.RefObject<T>
) {
  const handlerRef = React.useRef<typeof handler>();

  React.useEffect(() => {
    const target = element?.current || window;

    if (!target || !target.addEventListener) {
      return;
    }

    if (handlerRef.current !== handler) {
      handlerRef.current = handler;
    }

    const listener = (event: Event) => {
      if (handlerRef.current !== undefined) {
        handlerRef.current(event);
      }
    };

    target.addEventListener(name, listener);

    return () => {
      target.removeEventListener(name, listener);
    };
  }, [name, handler, element]);
}
