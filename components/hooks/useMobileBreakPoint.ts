import React, { useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

type UseMobileBreakPoint = () => boolean | 0 | null;

export const useMobileBreakPoint: UseMobileBreakPoint = () => {
  const [width, setWidth] = React.useState<number | null>(null);
  const resize = (): void => setWidth(window.innerWidth);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return (): void => window.removeEventListener('resize', resize);
  }, []);

  return width && width < MOBILE_BREAKPOINT;
};
