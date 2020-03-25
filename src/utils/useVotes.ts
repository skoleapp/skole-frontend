import { Size } from '@material-ui/core';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { PerformVoteMutation, usePerformVoteMutation, VoteObjectType } from '../../generated/graphql';
import { toggleNotification } from '../actions';
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

export const useVotes = ({ initialVote, initialPoints }: UseVotesProps): UseVotes => {
    const [vote, setVote] = useState(initialVote);
    const [points, setPoints] = useState(initialPoints);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    console.log(initialVote);

    const onError = (): void => {
        dispatch(toggleNotification(t('notifications:voteError')));
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
        disabled: voteSubmitting,
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
