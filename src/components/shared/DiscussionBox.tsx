import React from 'react';
import { CommentObjectType } from '../../../generated/graphql';
import { CommentCard } from './CommentCard';
import { Typography, Box, Divider } from '@material-ui/core';
import { useTranslation } from '../../i18n';
import { CreateCommentForm } from './CreateCommentForm';
import styled from 'styled-components';

interface Props {
    comments: CommentObjectType[];
}

export const DiscussionBox: React.FC<Props> = ({ comments }) => {
    const { t } = useTranslation();

    const renderHeader = (
        <Typography variant="subtitle1" color="textSecondary">
            {t('common:discussion')}
        </Typography>
    );

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
        <Box className="input-area" padding="0.5rem">
            <CreateCommentForm label={t('forms:message')} placeholder={t('forms:message')} />
        </Box>
    );

    return (
        <StyledDiscussionBox>
            {renderHeader}
            <Divider />
            {renderMessageArea}
            <Divider />
            {renderInputArea}
        </StyledDiscussionBox>
    );
};

const StyledDiscussionBox = styled(Box)`
    height: 100%;
    display: flex;
    flex-direction: column;

    .MuiInputBase-root {
        background-color: var(--white);
    }

    .message-area {
        flex-grow: 1;
        overflow-y: scroll;
        background-color: var(--primary-opacity);
    }

    .input-area {
    }
`;
