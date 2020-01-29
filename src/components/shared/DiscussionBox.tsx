import React from 'react';
import { CommentObjectType } from '../../../generated/graphql';
import { CommentCard } from './CommentCard';
import { Typography, Box, Fab, CardContent } from '@material-ui/core';
import { useTranslation } from '../../i18n';
import styled from 'styled-components';
import { AddOutlined } from '@material-ui/icons';
import { CreateCommentForm } from './CreateCommentForm';

interface Props {
    comments: CommentObjectType[];
}

export const DiscussionBox: React.FC<Props> = ({ comments }) => {
    const { t } = useTranslation();

    const renderMessageArea = (
        <Box className="message-area">
            {comments.length ? (
                comments.map((c: CommentObjectType, i: number) => (
                    <Box key={i} margin="0.5rem">
                        <CommentCard comment={c} />
                    </Box>
                ))
            ) : (
                <Typography variant="subtitle1">{t('comments:noComments')}</Typography>
            )}
        </Box>
    );

    const renderInputArea = (
        <Box className="md-up" padding="0.5rem">
            <CreateCommentForm label={t('forms:message')} placeholder={t('forms:message')} />
        </Box>
    );

    const renderNewMessageIcon = (
        <Box className="md-down" display="flex" justifyContent="flex-end" padding="0.5rem">
            <Fab color="primary" size="medium">
                <AddOutlined />
            </Fab>
        </Box>
    );

    return (
        <StyledDiscussionBox>
            {renderMessageArea}
            {renderInputArea}
            {renderNewMessageIcon}
        </StyledDiscussionBox>
    );
};

const StyledDiscussionBox = styled(CardContent)`
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .MuiInputBase-root {
        background-color: var(--white);
    }

    .message-area {
        flex-grow: 1;
        overflow-y: scroll;
        max-height: 55rem;
    }
`;
