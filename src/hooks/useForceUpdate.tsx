import { useCallback, useState } from 'react';

type UseForceUpdate = () => void;

// A custom hook that returns a function that you can use to re-render the component.
export const useForceUpdate = (): UseForceUpdate => {
    const [, setTick] = useState(0);

    const update = useCallback(() => {
        setTick(tick => tick + 1);
    }, []);

    return update;
};
