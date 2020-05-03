import { Size } from '@material-ui/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PerformVoteMutation, usePerformVoteMutation, VoteObjectType } from '../../generated/graphql';
import { useNotificationsContext } from '../context';
import { MuiColor } from '../types';

interface Variables {
    status: number;
    course?: string;
    resource?: string;
    comment?: string;
}

interface UseVotesProps {
    initialVote: VoteObjectType | null;
    initialScore: string;
    isOwner: boolean;
}

interface VoteButtonProps {
    color: MuiColor;
    disabled: boolean;
    size: Size;
}

interface UseVotes {
    upVoteButtonProps: VoteButtonProps;
    downVoteButtonProps: VoteButtonProps;
    score: string;
    handleVote: (variables: Variables) => void;
}

export const useVotes = ({ initialVote, initialScore, isOwner }: UseVotesProps): UseVotes => {
    const [vote, setVote] = useState(initialVote);
    const [score, setScore] = useState(initialScore);
    const { toggleNotification } = useNotificationsContext();
    const { t } = useTranslation();

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

    const handleVote = (variables: Variables): void => {
        performVote({ variables });
    };

    const commonVoteButtonProps = {
        size: 'small' as Size,
        disabled: voteSubmitting || isOwner,
    };

    const upVoteButtonProps = {
        ...commonVoteButtonProps,
        color: !!vote && vote.status === 1 ? 'primary' : ('default' as MuiColor),
    };

    const downVoteButtonProps = {
        ...commonVoteButtonProps,
        color: !!vote && vote.status === -1 ? 'primary' : ('default' as MuiColor),
    };

    return { upVoteButtonProps, downVoteButtonProps, score, handleVote };
};
