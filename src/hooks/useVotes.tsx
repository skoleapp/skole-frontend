import { IconButtonProps } from '@material-ui/core/IconButton';
import { useDarkModeContext, useNotificationsContext } from 'context';
import { useVoteMutation, VoteMutation, VoteObjectType } from 'generated';
import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { useLanguageHeaderContext } from './useLanguageHeaderContext';

interface VoteVariables {
  thread?: string;
  comment?: string;
}

interface UseVotesParams {
  initialVote: VoteObjectType | null;
  initialScore: number;
  variables: VoteVariables;
}

interface UseVotes {
  score: number;
  upvoteButtonProps: Partial<IconButtonProps>;
  downvoteButtonProps: Partial<IconButtonProps>;
  currentVote: VoteObjectType | null;
}

export const useVotes = ({ initialVote, initialScore, variables }: UseVotesParams): UseVotes => {
  const [currentVote, setCurrentVote] = useState<VoteObjectType | null>(null);
  const [score, setScore] = useState(0);
  const { toggleUnexpectedErrorNotification: onError } = useNotificationsContext();
  const { dynamicPrimaryColor } = useDarkModeContext();
  const context = useLanguageHeaderContext();

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  useEffect(() => {
    setScore(initialScore);
  }, [initialScore]);

  const onCompleted = ({ vote }: VoteMutation): void => {
    if (vote?.errors?.length) {
      onError();
    } else if (typeof vote?.targetScore === 'number') {
      setCurrentVote(vote.vote || null);
      setScore(vote.targetScore);
    }
  };

  const [vote, { loading: voteSubmitting }] = useVoteMutation({
    onCompleted,
    onError,
    context,
  });

  const handleVote = useCallback(
    (status: number) => async (e: SyntheticEvent): Promise<void> => {
      e.stopPropagation(); // Prevent opening comment thread for top-level comments.
      await vote({ variables: { status, ...variables } });
    },
    [variables, vote],
  );

  const commonVoteButtonProps: IconButtonProps = useMemo(
    () => ({
      size: 'small',
      disabled: voteSubmitting,
    }),
    [voteSubmitting],
  );

  const upvoteButtonProps: IconButtonProps = useMemo(
    () => ({
      ...commonVoteButtonProps,
      onClick: handleVote(1),
      color: currentVote?.status === 1 ? dynamicPrimaryColor : 'default',
    }),
    [commonVoteButtonProps, currentVote, dynamicPrimaryColor, handleVote],
  );

  const downvoteButtonProps: IconButtonProps = useMemo(
    () => ({
      ...commonVoteButtonProps,
      onClick: handleVote(-1),
      color: currentVote?.status === -1 ? dynamicPrimaryColor : 'default',
    }),
    [commonVoteButtonProps, currentVote, dynamicPrimaryColor, handleVote],
  );

  return {
    score,
    upvoteButtonProps,
    downvoteButtonProps,
    currentVote,
  };
};
