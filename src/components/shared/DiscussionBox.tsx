import React from 'react';
import { CommentObjectType } from '../../../generated/graphql';
import { CommentCard } from './CommentCard';
import { Typography, Box, Divider } from '@material-ui/core';
import { useTranslation } from '../../i18n';
import styled from 'styled-components';
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
                    <Box key={i} margin="0.25rem 0.25rem 0 0.25rem">
                        <CommentCard comment={c} />
                    </Box>
                ))
            ) : (
                <Typography variant="subtitle1">{t('comments:noComments')}</Typography>
            )}
        </Box>
    );

    const renderInputArea = (
        <Box padding="0.5rem">
            <CreateCommentForm label={t('forms:message')} placeholder={t('forms:message')} />
        </Box>
    );

    return (
        <StyledDiscussionBox>
            {renderMessageArea}
            <Divider />
            {renderInputArea}
        </StyledDiscussionBox>
    );
};

const StyledDiscussionBox = styled(Box)`
    display: flex;
    flex-direction: column;
    position: relative;

    .MuiInputBase-root {
        background-color: var(--white);
    }

    // TODO: Make the messages container responsive and the messages scrollable.
    .message-area {
        // overflow-y: scroll;
        background-color: var(--primary-opacity);
        padding-bottom: 0.25rem;

        ::-webkit-scrollbar {
            display: none;
        }
    }
`;
