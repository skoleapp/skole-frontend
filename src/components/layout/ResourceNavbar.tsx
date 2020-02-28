import { BottomNavigation, IconButton, Box } from '@material-ui/core';

import React, { useState, SyntheticEvent } from 'react';

import styled from 'styled-components';
import { FullscreenOutlined, KeyboardArrowDownOutlined, KeyboardArrowUpOutlined } from '@material-ui/icons';

import { usePerformVoteMutation, PerformVoteMutation, VoteMutationPayload } from '../../../generated/graphql';
import { breakpoints } from '../../styles';
import { useDispatch } from 'react-redux';
import { toggleNotification } from '../../actions';
import { useTranslation } from 'react-i18next';
interface Props {
    resource?: any;
}
export const ResourceNavbar: React.FC<Props> = ({ resource }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [vote, setVote] = useState(resource.points);

    console.log('vote: ', vote);
    console.log('resurssi: ', resource);

    const performVoteCompleted = ({ performVote }: PerformVoteMutation): void => {
        console.log('performVote: ', performVote);
        if (!!performVote) {
            if (!!performVote.errors) {
                performVoteError();
            } else {
                setVote(performVote.targetPoints as VoteMutationPayload);
            }
        }
    };
    const performVoteError = (): void => {
        dispatch(toggleNotification(t('notifications:voteError')));
    };

    const [performVote, { loading: voteSubmitting }] = usePerformVoteMutation({
        onCompleted: performVoteCompleted,
        onError: performVoteError,
    });

    const handleVote = (status: number) => (e: SyntheticEvent): void => {
        e.stopPropagation();
        const payload = { variables: { resource: resource.id, status } };
        console.log(payload);
        performVote(payload);
    };

    console.log(voteSubmitting);
    const renderVoteButtons = (
        <Box display="flex" alignItems="center">
            <IconButton onClick={handleVote(1)} color={!!vote && vote.status === 1 ? 'primary' : 'inherit'}>
                <KeyboardArrowUpOutlined className="vote-button" />
            </IconButton>
            {vote}
            <IconButton onClick={handleVote(-1)} color={!!vote && vote.status === -1 ? 'primary' : 'inherit'}>
                <KeyboardArrowDownOutlined className="vote-button" />
            </IconButton>
        </Box>
    );

    return (
        <StyledBottomNavbar>
            <IconButton onClick={() => {}}>
                <FullscreenOutlined />
            </IconButton>
            {renderVoteButtons}
        </StyledBottomNavbar>
    );
};

const StyledBottomNavbar = styled(BottomNavigation)`
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 3rem !important;
    border-top: var(--border);
    z-index: 1000;
    display: flex;
    justify-content: space-around !important;

    .MuiButtonBase-root,
    .Mui-selected {
        padding: 0 !important;
    }
    .MuiIconButton-root:hover {
        background-color: initial;
    }

    @media only screen and (min-width: ${breakpoints.MD}) {
        display: none !important;
    }
`;
