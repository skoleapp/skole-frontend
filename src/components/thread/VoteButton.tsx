import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDownOutlined from '@material-ui/icons/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlined from '@material-ui/icons/KeyboardArrowUpOutlined';
import {
  useAuthContext,
  useDarkModeContext,
  useNotificationsContext,
  useVoteContext,
} from 'context';
import { useVoteMutation, VoteMutation, VoteObjectType } from 'generated';
import { useLanguageHeaderContext } from 'hooks';
import { useTranslation } from 'lib';
import React, { Dispatch, SetStateAction, SyntheticEvent, useCallback, useMemo } from 'react';

interface VoteVariables {
  thread?: string;
  comment?: string;
}

interface Props {
  variant: 'upvote' | 'downvote';
  isOwn: boolean;
  variables: VoteVariables;
  currentVote: VoteObjectType | null;
  setCurrentVote: Dispatch<SetStateAction<VoteObjectType | null>>;
  setScore: Dispatch<SetStateAction<number>>;
}

export const VoteButton: React.FC<Props> = ({
  variant,
  isOwn,
  variables,
  currentVote,
  setCurrentVote,
  setScore,
}) => {
  const { handleOpenVotePrompt } = useVoteContext();
  const { t } = useTranslation();
  const { userMe } = useAuthContext();
  const { toggleUnexpectedErrorNotification: onError } = useNotificationsContext();
  const { dynamicPrimaryColor } = useDarkModeContext();
  const context = useLanguageHeaderContext();

  const upvoteTooltip =
    userMe && currentVote?.status === 1
      ? t('thread-tooltips:removeUpvote')
      : t('thread-tooltips:upvote') || '';

  const downvoteTooltip =
    userMe && currentVote?.status === -1
      ? t('thread-tooltips:removeDownvote')
      : t('thread-tooltips:downvote') || '';

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

      if (isOwn) {
        handleOpenVotePrompt();
      } else {
        await vote({ variables: { status, ...variables } });
      }
    },
    [variables, vote, isOwn, handleOpenVotePrompt],
  );

  const voteButtonProps: IconButtonProps = useMemo(
    () => ({
      size: 'small',
      disabled: voteSubmitting || !userMe,
    }),
    [voteSubmitting, userMe],
  );

  switch (variant) {
    case 'upvote': {
      return (
        <Tooltip title={upvoteTooltip}>
          <Typography component="span">
            <IconButton
              {...voteButtonProps}
              onClick={handleVote(1)}
              color={currentVote?.status === 1 ? dynamicPrimaryColor : 'default'}
            >
              <KeyboardArrowUpOutlined />
            </IconButton>
          </Typography>
        </Tooltip>
      );
    }

    case 'downvote': {
      return (
        <Tooltip title={downvoteTooltip}>
          <Typography component="span">
            <IconButton
              {...voteButtonProps}
              onClick={handleVote(-1)}
              color={currentVote?.status === -1 ? dynamicPrimaryColor : 'default'}
            >
              <KeyboardArrowDownOutlined />
            </IconButton>
          </Typography>
        </Tooltip>
      );
    }

    default: {
      return null;
    }
  }
};
