import { IconButton, Size, Tooltip, Typography } from '@material-ui/core';
import { ThumbDownOutlined, ThumbUpOutlined } from '@material-ui/icons';
import { useAuthContext, useNotificationsContext } from 'context';
import { useVoteMutation, VoteMutation, VoteObjectType } from 'generated';
import { useTranslation } from 'lib';
import React, { SyntheticEvent, useState } from 'react';

import { MuiColor } from 'types';
import { useLanguageHeaderContext } from './useLanguageHeaderContext';

interface VoteVariables {
  course?: string;
  resource?: string;
  comment?: string;
}

interface UseVotesProps {
  initialVote: VoteObjectType | null;
  initialScore: string;
  isOwner: boolean;
  variables: VoteVariables;
}

interface VoteButtonProps {
  color: MuiColor;
  disabled: boolean;
  size: Size;
}

interface UseVotes {
  renderUpVoteButton: JSX.Element;
  renderDownVoteButton: JSX.Element;
  score: string;
  upVoteButtonProps: VoteButtonProps;
  downVoteButtonProps: VoteButtonProps;
  upVoteButtonTooltip: string;
  downVoteButtonTooltip: string;
}

// A hook that allows usage of either default vote buttons (used in course/resource details) or using props for custom vote buttons.
export const useVotes = ({
  initialVote,
  initialScore,
  isOwner,
  variables,
}: UseVotesProps): UseVotes => {
  const { userMe, verified, loginRequiredTooltip, verificationRequiredTooltip } = useAuthContext();

  const { t } = useTranslation();
  const [currentVote, setCurrentVote] = useState(initialVote);
  const [score, setScore] = useState(initialScore);
  const { toggleNotification } = useNotificationsContext();
  const ownContentTooltip = t('tooltips:voteOwnContent');
  const context = useLanguageHeaderContext();

  const upVoteButtonTooltip =
    loginRequiredTooltip ||
    verificationRequiredTooltip ||
    (isOwner ? ownContentTooltip : t('tooltips:upVote'));

  const downVoteButtonTooltip =
    loginRequiredTooltip ||
    verificationRequiredTooltip ||
    (isOwner ? ownContentTooltip : t('tooltips:downVote'));

  const onError = (): void => {
    toggleNotification(t('notifications:voteError'));
  };

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

  const upVoteButtonProps = {
    ...commonVoteButtonProps,
    onClick: handleVote(1),
    color: !!currentVote && currentVote.status === 1 ? 'primary' : ('default' as MuiColor),
  };

  const downVoteButtonProps = {
    ...commonVoteButtonProps,
    onClick: handleVote(-1),
    color: !!currentVote && currentVote.status === -1 ? 'primary' : ('default' as MuiColor),
  };

  const renderUpVoteButton = (
    <Tooltip title={upVoteButtonTooltip}>
      <Typography component="span">
        <IconButton {...upVoteButtonProps}>
          <ThumbUpOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  );

  const renderDownVoteButton = (
    <Tooltip title={downVoteButtonTooltip}>
      <Typography component="span">
        <IconButton {...downVoteButtonProps}>
          <ThumbDownOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  );

  return {
    renderUpVoteButton,
    renderDownVoteButton,
    upVoteButtonProps,
    downVoteButtonProps,
    score,
    upVoteButtonTooltip,
    downVoteButtonTooltip,
  };
};
