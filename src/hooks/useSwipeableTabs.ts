import { useDiscussionContext } from 'context';
import { CommentObjectType } from 'generated';
import { useRouter } from 'next/router';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

interface UseSwipeableTabs {
  tabValue: number;
  setTabValue: Dispatch<SetStateAction<number>>;
  handleTabChange: (
    _e: ChangeEvent<Record<symbol, unknown>>,
    val: number
  ) => void;
  handleIndexChange: (i: number) => void;
}

// Custom hook that provides event handlers for using MUI tabs together with react-swipeable-views.
// For tabs that contain discussion tab as the right-hand tab (currently course and resource pages),
// if a comment has been provided as a query parameter, i.e. user navigates to page via link to a comment,
// we change to the discussion tab and open comment modal automatically.
export const useSwipeableTabs = (
  comments?: CommentObjectType[]
): UseSwipeableTabs => {
  const { query } = useRouter();
  const { toggleTopComment } = useDiscussionContext();
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (
    _e: ChangeEvent<Record<symbol, unknown>>,
    val: number
  ): void => setTabValue(val);
  const handleIndexChange = (i: number): void => setTabValue(i);

  useEffect(() => {
    if (!!comments && query.comment) {
      const comment = comments.find((c) => c.id === query.comment);

      if (comment) {
        toggleTopComment(comment); // Query is  a top level comment.
      } else {
        // Query is a reply comment. We find it's top level comment.
        const comment = comments.find((c) =>
          c.replyComments.some((r) => r.id === query.comment)
        );

        if (comment) {
          setTabValue(1);
          toggleTopComment(comment);
        }
      }
    }
  }, [comments]);

  return { tabValue, setTabValue, handleTabChange, handleIndexChange };
};
