import { useEffect, useState } from 'react';

// Hook to define whether to render mobile or desktop content.
// Only works in the client. Default width is set to 0 so mobile
// content will be SSR'd by default.
export const useBreakPoint = (breakpoint: number): boolean => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        setWidth(window.innerWidth);
        const resizeFunctionRef = (): void => setWidth(window.innerWidth);
        window.addEventListener('resize', resizeFunctionRef);
        return (): void => {
            window.removeEventListener('resize', resizeFunctionRef);
        };
    }, []);

    return width < breakpoint;
};
