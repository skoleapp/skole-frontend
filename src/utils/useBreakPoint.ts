import { useEffect, useState } from 'react';

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
