import { useDiscussionContext } from 'context';
import { CommentObjectType } from 'generated';
import { useRouter } from 'next/router';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { TabPanelProps } from 'types';

interface CustomTabsProps {
  value: number;
  onChange: (_e: ChangeEvent<Record<symbol, unknown>>, val: number) => void;
}

interface UseTabs {
  tabValue: number;
  setTabValue: Dispatch<SetStateAction<number>>;
  tabsProps: CustomTabsProps;
  leftTabPanelProps: TabPanelProps;
  rightTabPanelProps: TabPanelProps;
}

// Custom helper hook for views that contain tabs.
// If a comment has been provided as a query parameter, change to the discussion tab and open comment modal automatically.
export const useTabs = (comments?: CommentObjectType[]): UseTabs => {
  const { query } = useRouter();
  const { setTopComment } = useDiscussionContext();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_e: ChangeEvent<Record<symbol, unknown>>, val: number): void =>
    setTabValue(val);

  useEffect(() => {
    if (!!comments && query.comment) {
      const comment = comments.find((c) => c.id === query.comment);

      if (comment) {
        setTopComment(comment); // Query is  a top level comment.
      } else {
        // Query is a reply comment. We find it's top level comment.
        const comment = comments.find((c) => c.replyComments.some((r) => r.id === query.comment));

        if (comment) {
          setTabValue(1);
          setTopComment(comment);
        }
      }
    }
  }, [comments, query]);

  const valueProp = {
    value: tabValue,
  };

  const tabsProps = {
    ...valueProp,
    onChange: handleTabChange,
  };

  const leftTabPanelProps = {
    ...valueProp,
    index: 0,
  };

  const rightTabPanelProps = {
    ...valueProp,
    index: 1,
  };

  return { tabValue, setTabValue, tabsProps, leftTabPanelProps, rightTabPanelProps };
};
