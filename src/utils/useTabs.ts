import { ChangeEvent, useState } from 'react';

export const useTabs = () => {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (_e: ChangeEvent<{}>, val: number) => setTabValue(val);
  return { tabValue, handleTabChange };
};
