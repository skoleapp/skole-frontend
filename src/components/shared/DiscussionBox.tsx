import React from 'react';
import { CommentObjectType } from '../../../generated/graphql';
import { CommentCard } from './CommentCard';
import { Box } from '@material-ui/core';
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
        <Box className="input-area">
            <CreateCommentForm
                label={!!thread ? t('forms:reply') : t('forms:message')}
                placeholder={!!thread ? t('forms:reply') : t('forms:message')}
            />
        </Box>
    );

    return (
        <StyledDiscussionBox>
            {renderMessageArea}
            {renderInputArea}
        </StyledDiscussionBox>
    );
};

const StyledDiscussionBox = styled(Box)`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    position: relative;

    // TODO: Make the messages container responsive and the messages scrollable.
    .message-area {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 5.25rem;
        overflow-y: scroll;

        ::-webkit-scrollbar {
            display: none;
        }
    }

    .input-area {
        position: absolute;
        top: auto;
        left: 0;
        bottom: 0;
        right: 0;
        padding: 0.5rem;
        border-top: var(--border);
    }
`;
