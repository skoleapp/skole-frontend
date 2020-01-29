import React from 'react';
import { CommentObjectType } from '../../../generated/graphql';
import { CommentCard } from './CommentCard';
import { Box, Divider } from '@material-ui/core';
import { useTranslation } from '../../i18n';
import styled from 'styled-components';
import { CreateCommentForm } from './CreateCommentForm';

interface Props {
    comments: CommentObjectType[];
    thread?: boolean;
}

export const DiscussionBox: React.FC<Props> = ({ comments, thread }) => {
    const { t } = useTranslation();

    const renderMessageArea = (
        <Box className="message-area">
            {comments.map((c: CommentObjectType, i: number) => (
                <Box key={i}>
                    <CommentCard comment={c} disableClick={!!thread} />
                </Box>
            ))}
        </Box>
    );

    const renderInputArea = (
        <Box padding="0.5rem">
            <CreateCommentForm
                label={!!thread ? t('forms:reply') : t('forms:message')}
                placeholder={!!thread ? t('forms:reply') : t('forms:message')}
            />
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

    // TODO: Make the messages container responsive and the messages scrollable.
    .message-area {
        overflow-y: scroll;
        margin-bottom: -1px; // Negate the bottom border for the last comment.

        ::-webkit-scrollbar {
            display: none;
        }
    }
`;
