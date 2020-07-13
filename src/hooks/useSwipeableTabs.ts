import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

interface UseSwipeableTabs {
    tabValue: number;
    setTabValue: Dispatch<SetStateAction<number>>;
    handleTabChange: (_e: ChangeEvent<{}>, val: number) => void;
    handleIndexChange: (i: number) => void;
}

// Custom hook that provides event handlers for using MUI tabs together with react-swipeable-views.
export const useSwipeableTabs = (): UseSwipeableTabs => {
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (_e: ChangeEvent<{}>, val: number): void => setTabValue(val);
    const handleIndexChange = (i: number): void => setTabValue(i);
    return { tabValue, setTabValue, handleTabChange, handleIndexChange };
};
