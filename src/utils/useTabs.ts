import { ChangeEvent, useState } from 'react';

interface UseTabs {
    tabValue: number;
    handleTabChange: (_e: ChangeEvent<{}>, val: number) => void;
}

export const useTabs = (): UseTabs => {
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (_e: ChangeEvent<{}>, val: number): void => setTabValue(val);
    return { tabValue, handleTabChange };
};
