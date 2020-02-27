import { Box, Divider, Fab, Fade, IconButton, Paper, Typography } from '@material-ui/core';
import { AddOutlined, SendOutlined } from '@material-ui/icons';
import * as R from 'ramda';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { CommentObjectType } from '../../../generated/graphql';
import { breakpoints } from '../../styles';
import { CommentTarget } from '../../types';
import { CommentCard } from './CommentCard';
import { CreateCommentForm } from './CreateCommentForm';
import { ModalHeader } from './ModalHeader';
import { StyledModal } from './StyledModal';

interface Props {
    commentThread?: CommentObjectType | null;
    comments: CommentObjectType[];
    isThread?: boolean;
    target: CommentTarget;
}

export const DiscussionBox: React.FC<Props> = ({
    commentThread: topComment,
    comments: initialComments,
    isThread,
    target,
}) => {
    const [comments, setComments] = useState(initialComments);
    const initialReplyCount = R.propOr('-', 'replyCount', topComment);
    const [replyCount, setReplyCount] = useState(initialReplyCount);
    const [mobileCreateComment, setMobileCreateComment] = useState(false);
    const handleCloseMobileCreateComment = (): void => setMobileCreateComment(false);
    const updateReplyCount = (): void => setReplyCount(comments.length);
    const { t } = useTranslation();

    const appendComments = (comment: CommentObjectType): void => {
        setComments([...comments, comment]);
        updateReplyCount();
        setMobileCreateComment(false);
    };

    const removeComment = (id: string): void => {
        setComments(comments.filter((c: CommentObjectType): boolean => c.id !== id));
        updateReplyCount();
    };

    const commentCardProps = { isThread, removeComment };
    const createCommentFormProps = { target, appendComments };

    const renderTopComment = !!topComment && (
        <>
            <CommentCard comment={topComment} {...commentCardProps} />
            <Box padding="0.25rem 0.5rem" display="flex" alignItems="center">
                <Typography variant="subtitle2" color="textSecondary">
                    {replyCount} replies
                </Typography>
                <Divider />
            </Box>
        </>
    );

    const renderMessageArea = (
        <Box className="message-area">
            {renderTopComment}
            {comments.map((c: CommentObjectType, i: number) => (
                <Box key={i}>
                    <CommentCard comment={c} {...commentCardProps} />
                </Box>
            ))}
        </Box>
    );

    const renderInputArea = (
        <Box className={`${!topComment && 'md-up'} input-area`}>
            <CreateCommentForm {...createCommentFormProps} />
        </Box>
    );

    const renderMobileCreateCommentButton = !topComment && (
        <Fab
            id="create-comment-button"
            className="md-down"
            color="primary"
            onClick={(): void => setMobileCreateComment(true)}
        >
            <AddOutlined />
        </Fab>
    );

    const renderSubmitButton = (
        <IconButton color="primary">
            <SendOutlined />
        </IconButton>
    );

    const renderMobileCreateComment = (
        <StyledModal className="md-down" open={!!mobileCreateComment} onClose={handleCloseMobileCreateComment}>
            <Fade in={!!mobileCreateComment}>
                <Paper>
                    <ModalHeader
                        title={t('common:createComment')}
                        onCancel={handleCloseMobileCreateComment}
                        headerRight={renderSubmitButton}
                    />
                    <Box flexGrow="1" display="flex" alignItems="flex-end">
                        <Box className="modal-input-area" flexGrow="1">
                            <CreateCommentForm {...createCommentFormProps} />
                        </Box>
                    </Box>
                </Paper>
            </Fade>
        </StyledModal>
    );

    return (
        <StyledDiscussionBox topComment={topComment}>
            <Box className="discussion-container">
                {renderMessageArea}
                {renderInputArea}
                {renderMobileCreateCommentButton}
                {renderMobileCreateComment}
            </Box>
        </StyledDiscussionBox>
    );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDiscussionBox = styled(({ topComment, ...other }) => <Box {...other} />)`
    position: relative;
    flex-grow: 1;

    .discussion-container {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        .message-area {
            flex-grow: 1;
            overflow-y: scroll;

            .MuiDivider-root {
                flex-grow: 1;
                margin-left: 0.5rem;
            }
        }

        .input-area {
            padding: 0.5rem;
            border-top: var(--border);

            @media only screen and (min-width: ${breakpoints.MD}) {
                padding: ${({ topComment }): string | false => !!topComment && '0.5rem 0 0 0 !important'};
            }
        }

        #create-comment-button {
            position: absolute;
            bottom: 0.5rem;
            left: 0;
            right: 0;
            margin-left: auto;
            margin-right: auto;
            opacity: 0.5;
        }
    }
`;
