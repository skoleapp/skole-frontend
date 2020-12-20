import { IconButton, Size, Tooltip, Typography } from '@material-ui/core';
import { ThumbDownOutlined, ThumbUpOutlined } from '@material-ui/icons';
import { useAuthContext, useNotificationsContext } from 'context';
import { useVoteMutation, VoteMutation, VoteObjectType } from 'generated';
import { useTranslation } from 'lib';
import React, { SyntheticEvent, useEffect, useState } from 'react';

import { MuiColor } from 'types';
import { useLanguageHeaderContext } from './useLanguageHeaderContext';
import { useMediaQueries } from './useMediaQueries';

interface VoteVariables {
  course?: string;
  resource?: string;
  comment?: string;
}

interface UseVotesParams {
  initialVote: VoteObjectType | null;
  initialScore: string;
  isOwner: boolean;
  variables: VoteVariables;
  target: string;
  customRemoveUpvoteTooltip?: string;
  customUpvoteTooltip?: string;
  customRemoveDownvoteTooltip?: string;
  customDownvoteTooltip?: string;
}

interface VoteButtonProps {
  color: MuiColor;
  disabled: boolean;
  size: Size;
}

interface UseVotes {
  score: string;
  renderUpvoteButton: JSX.Element | false;
  renderDownvoteButton: JSX.Element | false;
  upvoteButtonProps: VoteButtonProps;
  downvoteButtonProps: VoteButtonProps;
  upvoteTooltip: string;
  downvoteTooltip: string;
}

// A hook that allows usage of either default vote buttons (used in course/resource details) or using props for custom vote buttons.
export const useVotes = ({
  initialVote,
  initialScore,
  isOwner,
  variables,
  target,
  customRemoveUpvoteTooltip,
  customUpvoteTooltip,
  customRemoveDownvoteTooltip,
  customDownvoteTooltip,
}: UseVotesParams): UseVotes => {
  const { userMe, verified, loginRequiredTooltip, verificationRequiredTooltip } = useAuthContext();
  const { t } = useTranslation();
  const { isTabletOrDesktop } = useMediaQueries();
  const [currentVote, setCurrentVote] = useState(initialVote);
  const [score, setScore] = useState(initialScore);
  const { toggleNotification } = useNotificationsContext();
  const ownContentTooltip = t('tooltips:voteOwnContent', { target });
  const context = useLanguageHeaderContext();

  const error =
    currentVote?.status === 1
      ? t('notifications:removeVoteError', { target })
      : t('notifications:voteError', { target });

  const onError = (): void => toggleNotification(error);

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  // Show different tooltip for each of these cases:
  // * User is not logged in.
  // * User is not verified.
  // * User is the owner of the object.
  // * User has upvoted (can be overridden with a custom tooltip).
  // * User has not upvoted (can be overridden with a custom tooltip).
  const upvoteTooltip =
    loginRequiredTooltip ||
    verificationRequiredTooltip ||
    (isOwner
      ? ownContentTooltip
      : currentVote?.status === 1
      ? customRemoveUpvoteTooltip || t('tooltips:removeUpvote', { target })
      : customUpvoteTooltip || t('tooltips:upvote', { target }));

  // Show different tooltip for each of these cases:
  // * User is not logged in.
  // * User is not verified.
  // * User is the owner of the object.
  // * User has downvoted (can be overridden with a custom tooltip).
  // * User has not downvoted (can be overridden with a custom tooltip).
  const downvoteTooltip =
    loginRequiredTooltip ||
    verificationRequiredTooltip ||
    (isOwner
      ? ownContentTooltip
      : currentVote?.status === -1
      ? customRemoveDownvoteTooltip || t('tooltips:removeDownvote', { target })
      : customDownvoteTooltip || t('tooltips:downvote', { target }));

  const onCompleted = ({ vote }: VoteMutation): void => {
    if (vote) {
      if (!!vote.errors && !!vote.errors.length) {
        onError();
      } else {
        setCurrentVote(vote.vote as VoteObjectType);
        setScore(String(vote.targetScore));
      }
    }
  };

  const [vote, { loading: voteSubmitting }] = useVoteMutation({
    onCompleted,
    onError,
    context,
  });

  const handleVote = (status: number) => async (e: SyntheticEvent): Promise<void> => {
    e.stopPropagation(); // Prevent opening comment thread for top-level comments.
    await vote({ variables: { status, ...variables } });
  };

  const commonVoteButtonProps = {
    size: 'small' as Size,
    disabled: voteSubmitting || !userMe || isOwner || verified === false,
  };

  const upvoteButtonProps = {
    ...commonVoteButtonProps,
    onClick: handleVote(1),
    color: !!currentVote && currentVote.status === 1 ? 'primary' : ('default' as MuiColor),
  };

  const downvoteButtonProps = {
    ...commonVoteButtonProps,
    onClick: handleVote(-1),
    color: !!currentVote && currentVote.status === -1 ? 'primary' : ('default' as MuiColor),
  };

  // On desktop, render a disabled button for non-verified users and for users who are the creators of the comment.
  // On mobile, do not render the button at all in these cases.
  const renderUpvoteButton = ((!!verified && !isOwner) || isTabletOrDesktop) && (
    <Tooltip title={upvoteTooltip}>
      <Typography component="span">
        <IconButton {...upvoteButtonProps}>
          <ThumbUpOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  );

  // On desktop, render a disabled button for non-verified users and for users who are the creators of the comment.
  // On mobile, do not render the button at all in these cases.
  const renderDownvoteButton = ((!!verified && !isOwner) || isTabletOrDesktop) && (
    <Tooltip title={downvoteTooltip}>
      <Typography component="span">
        <IconButton {...downvoteButtonProps}>
          <ThumbDownOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
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
