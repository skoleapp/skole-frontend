import React, { useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export const useMobileBreakPoint = () => {
  const [width, setWidth] = React.useState();
  const resize = () => setWidth(window.innerWidth);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return width < MOBILE_BREAKPOINT;
};
