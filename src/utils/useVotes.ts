import { Size } from '@material-ui/core';
import { useState } from 'react';

import { PerformVoteMutation, usePerformVoteMutation, VoteObjectType } from '../../generated/graphql';
import { useSkoleContext } from '../context';
import { useTranslation } from '../i18n';
import { MuiColor } from '../types';

interface Variables {
    status: number;
    course?: string;
    resource?: string;
    comment?: string;
}

interface UseVotesProps {
    initialVote: VoteObjectType | null;
    initialPoints: number;
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
    points: number;
    handleVote: (variables: Variables) => void;
}

export const useVotes = ({ initialVote, initialPoints, isOwner }: UseVotesProps): UseVotes => {
    const [vote, setVote] = useState(initialVote);
    const [points, setPoints] = useState(initialPoints);
    const { toggleNotification } = useSkoleContext();
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
                setPoints(performVote.targetPoints as number);
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

    return { upVoteButtonProps, downVoteButtonProps, points, handleVote };
};
