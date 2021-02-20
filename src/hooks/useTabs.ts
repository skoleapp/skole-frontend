import { useRouter } from 'next/router';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { TabPanelProps } from 'types';

import { useMediaQueries } from './useMediaQueries';

interface CustomTabsProps {
  value: number;
  onChange: (_e: ChangeEvent<Record<symbol, unknown>>, val: number) => void;
}

interface UseTabs {
  tabValue: number;
  setTabValue: Dispatch<SetStateAction<number>>;
  tabsProps: CustomTabsProps;
  firstTabPanelProps: TabPanelProps;
  secondTabPanelProps: TabPanelProps;
  thirdTabPanelProps: TabPanelProps;
}

// Custom helper hook for views that contain tabs.
export const useTabs = (discussionTabIndex = 1): UseTabs => {
  const { query } = useRouter();
  const { isMobile } = useMediaQueries();
  const [tabValue, setTabValue] = useState(0);

  const valueProp = {
    value: tabValue,
  };

  // If a comment has been provided as a query parameter, automatically switch to discussion tab on mobile.
  useEffect(() => {
    if (!!query.comment && isMobile) {
      setTabValue(discussionTabIndex);
    }
  }, [query, isMobile]);

  const handleTabChange = (_e: ChangeEvent<Record<symbol, unknown>>, val: number): void =>
    setTabValue(val);

  const tabsProps = {
    ...valueProp,
    onChange: handleTabChange,
  };

  const firstTabPanelProps = {
    ...valueProp,
    index: 0,
  };

  const secondTabPanelProps = {
    ...valueProp,
    index: 1,
  };

  const thirdTabPanelProps = {
    ...valueProp,
    index: 2,
  };

  return {
    tabValue,
    setTabValue,
    tabsProps,
    firstTabPanelProps,
    secondTabPanelProps,
    thirdTabPanelProps,
  };
};
