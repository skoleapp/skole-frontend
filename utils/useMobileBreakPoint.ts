import React, { useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export const useMobileBreakPoint = () => {
  const [width, setWidth] = React.useState<number | null>(null);

  useEffect(() => {
    const resize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return width && width < MOBILE_BREAKPOINT;
};
