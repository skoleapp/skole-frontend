import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ThumbDownOutlined from '@material-ui/icons/ThumbDownOutlined';
import ThumbUpOutlined from '@material-ui/icons/ThumbUpOutlined';
import { useAuthContext, useDarkModeContext, useNotificationsContext } from 'context';
import { useVoteMutation, VoteMutation, VoteObjectType } from 'generated';
import React, { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { useLanguageHeaderContext } from './useLanguageHeaderContext';

interface VoteVariables {
  thread?: string;
  comment?: string;
}

interface UseVotesParams {
  initialVote: VoteObjectType | null;
  initialScore: string;
  isOwner: boolean;
  variables: VoteVariables;
  upvoteTooltip: string;
  removeUpvoteTooltip: string;
  downvoteTooltip: string;
  removeDownvoteTooltip: string;
}

interface UseVotes {
  score: string;
  renderUpvoteButton: JSX.Element | false;
  renderDownvoteButton: JSX.Element | false;
  upvoteButtonProps: Partial<IconButtonProps>;
  downvoteButtonProps: Partial<IconButtonProps>;
  upvoteTooltip: string;
  downvoteTooltip: string;
}

export const useVotes = ({
  initialVote,
  initialScore,
  isOwner,
  variables,
  removeUpvoteTooltip,
  upvoteTooltip: _upvoteTooltip,
  removeDownvoteTooltip,
  downvoteTooltip: _downvoteTooltip,
}: UseVotesParams): UseVotes => {
  const { verified } = useAuthContext();
  const [currentVote, setCurrentVote] = useState(initialVote);
  const [score, setScore] = useState(initialScore);
  const { toggleUnexpectedErrorNotification: onError } = useNotificationsContext();
  const { dynamicPrimaryColor } = useDarkModeContext();
  const context = useLanguageHeaderContext();

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  useEffect(() => {
    setScore(initialScore);
  }, [initialScore]);

  // Show a dynamic tooltip based on the vote status.
  const upvoteTooltip = (currentVote?.status === 1 && removeUpvoteTooltip) || _upvoteTooltip;

  // Show a dynamic tooltip based on the vote status.
  const downvoteTooltip = (currentVote?.status === -1 && removeDownvoteTooltip) || _downvoteTooltip;

  const onCompleted = ({ vote }: VoteMutation): void => {
    if (vote?.errors?.length) {
      onError();
    } else if (vote?.targetScore !== undefined) {
      setCurrentVote(vote.vote || null);
      setScore(String(vote.targetScore));
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
      color: !!currentVote && currentVote.status === 1 ? dynamicPrimaryColor : 'default',
    }),
    [commonVoteButtonProps, currentVote, dynamicPrimaryColor, handleVote],
  );

  const downvoteButtonProps: IconButtonProps = useMemo(
    () => ({
      ...commonVoteButtonProps,
      onClick: handleVote(-1),
      color: !!currentVote && currentVote.status === -1 ? dynamicPrimaryColor : 'default',
    }),
    [commonVoteButtonProps, currentVote, dynamicPrimaryColor, handleVote],
  );

  // Only render for verified user who are not owners.
  const renderUpvoteButton = useMemo(
    () =>
      !!verified &&
      !isOwner && (
        <Tooltip title={upvoteTooltip}>
          <Typography component="span">
            <IconButton {...upvoteButtonProps}>
              <ThumbUpOutlined />
            </IconButton>
          </Typography>
        </Tooltip>
      ),
    [isOwner, upvoteButtonProps, upvoteTooltip, verified],
  );

  // Only render for verified user who are not owners.
  const renderDownvoteButton = useMemo(
    () =>
      !!verified &&
      !isOwner && (
        <Tooltip title={downvoteTooltip}>
          <Typography component="span">
            <IconButton {...downvoteButtonProps}>
              <ThumbDownOutlined />
            </IconButton>
          </Typography>
        </Tooltip>
      ),
    [downvoteButtonProps, downvoteTooltip, isOwner, verified],
  );

  return {
    score,
    renderUpvoteButton,
    renderDownvoteButton,
    upvoteButtonProps,
    downvoteButtonProps,
    upvoteTooltip,
    downvoteTooltip,
  };
};
