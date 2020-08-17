import { IconButton, Size, Tooltip } from '@material-ui/core';
import { ThumbDownOutlined, ThumbUpOutlined } from '@material-ui/icons';
import { useAuthContext, useNotificationsContext } from 'context';
import { PerformVoteMutation, usePerformVoteMutation, VoteObjectType } from 'generated';
import { useTranslation } from 'lib';
import React, { SyntheticEvent } from 'react';
import { useState } from 'react';
import { MuiColor } from 'types';

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
    upVoteButtonTooltip: string;
    downVoteButtonTooltip: string;
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
}

// A hook that allows usage of either default vote buttons (used in course/resource details) or using props for custom vote buttons.
export const useVotes = ({
    initialVote,
    initialScore,
    isOwner,
    variables,
    upVoteButtonTooltip,
    downVoteButtonTooltip,
}: UseVotesProps): UseVotes => {
    const { t } = useTranslation();
    const { verified } = useAuthContext();
    const [vote, setVote] = useState(initialVote);
    const [score, setScore] = useState(initialScore);
    const { toggleNotification } = useNotificationsContext();

    const onError = (): void => {
        toggleNotification(t('notifications:voteError'));
    };

    const onCompleted = ({ performVote }: PerformVoteMutation): void => {
        if (!!performVote) {
            if (!!performVote.errors) {
                onError();
            } else {
                setVote(performVote.vote as VoteObjectType);
                setScore(String(performVote.targetScore));
            }
        }
    };

    const [performVote, { loading: voteSubmitting }] = usePerformVoteMutation({ onCompleted, onError });

    const handleVote = (status: number) => (e: SyntheticEvent): void => {
        e.stopPropagation(); // Prevent opening comment thread for top-level comments.
        performVote({ variables: { status, ...variables } });
    };

    const commonVoteButtonProps = {
        size: 'small' as Size,
        disabled: voteSubmitting || isOwner || verified === false,
    };

    const upVoteButtonProps = {
        ...commonVoteButtonProps,
        onClick: handleVote(1),
        color: !!vote && vote.status === 1 ? 'primary' : ('default' as MuiColor),
    };

    const downVoteButtonProps = {
        ...commonVoteButtonProps,
        onClick: handleVote(-1),
        color: !!vote && vote.status === -1 ? 'primary' : ('default' as MuiColor),
    };

    const renderUpVoteButton = (
        <Tooltip title={upVoteButtonTooltip}>
            <span>
                <IconButton {...upVoteButtonProps}>
                    <ThumbUpOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );

    const renderDownVoteButton = (
        <Tooltip title={downVoteButtonTooltip}>
            <span>
                <IconButton {...downVoteButtonProps}>
                    <ThumbDownOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );

    return { renderUpVoteButton, renderDownVoteButton, upVoteButtonProps, downVoteButtonProps, score };
};
