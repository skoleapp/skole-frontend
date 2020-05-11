import { Box, Button, Divider, Fab, Typography } from '@material-ui/core';
import { AddOutlined } from '@material-ui/icons';
import * as R from 'ramda';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { CommentObjectType } from '../../../generated/graphql';
import { useCommentModalContext, useDeviceContext, useDiscussionBoxContext } from '../../context';
import { breakpoints } from '../../styles';
import { DiscussionBoxProps } from '../../types';
import { CommentCard } from './CommentCard';
import { CreateCommentForm } from './CreateCommentForm';
import { NotFoundBox } from './NotFoundBox';

export const DiscussionBox: React.FC<DiscussionBoxProps> = ({
    topComment,
    comments: initialComments,
    isThread,
    target,
    formKey,
    placeholderText,
}) => {
    const { comments, setComments } = useDiscussionBoxContext(initialComments);
    const initialReplyCount = R.propOr('', 'replyCount', topComment);
    const [replyCount, setReplyCount] = useState(initialReplyCount);
    const { toggleCommentModal } = useCommentModalContext();
    const openCommentModal = (): void => toggleCommentModal(true);
    const { t } = useTranslation();
    const isMobile = useDeviceContext();
    const updateReplyCount = (replyCount: number): void => setReplyCount(replyCount);

    const appendComments = (comment: CommentObjectType): void => {
        setComments([...comments, comment]);
        isThread && updateReplyCount(comments.length + 1);
    };

    const removeComment = (id: string): void => {
        setComments(comments.filter((c: CommentObjectType): boolean => c.id !== id));
        isThread && updateReplyCount(comments.length - 1);
    };

    const commentCardProps = { isThread, removeComment };

    const createCommentFormProps = {
        target,
        appendComments,
        formKey,
    };

    const renderTopComment = !!topComment && (
        <>
            <CommentCard comment={topComment} {...commentCardProps} disableBorder />
            <Box padding="0.25rem 0.5rem" display="flex" alignItems="center">
                <Typography variant="subtitle2" color="textSecondary">
                    {replyCount} replies
                </Typography>
                <Divider id="reply" />
            </Box>
        </>
    );

    const renderReplyButton = !!topComment && isMobile && (
        <Box marginTop="auto">
            <Divider />
            <Box padding="0.5rem">
                <Button onClick={openCommentModal} color="primary" variant="contained" fullWidth>
                    {t('common:reply')}
                </Button>
            </Box>
        </Box>
    );

    const renderMessageArea = (
        <Box className="message-area">
            {renderTopComment}
            {!!comments.length
                ? comments.map((c: CommentObjectType, i: number) => (
                      <Box key={i}>
                          <CommentCard comment={c} {...commentCardProps} />
                      </Box>
                  ))
                : !topComment && !!placeholderText && <NotFoundBox text={placeholderText} />}
            {renderReplyButton}
        </Box>
    );

    const renderInputArea = (
        <Box className="input-area">
            <CreateCommentForm {...createCommentFormProps} />
        </Box>
    );

    const renderMobileCreateCommentButton = !topComment && isMobile && (
        <Fab id="create-comment-button" color="primary" onClick={openCommentModal}>
            <AddOutlined />
        </Fab>
    );

    return (
        <StyledDiscussionBox topComment={topComment}>
            <Box className="discussion-container">
                {renderMessageArea}
                {renderInputArea}
                {renderMobileCreateCommentButton}
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
            display: flex;
            flex-direction: column;
            overflow-y: scroll;

            @media only screen and (max-width: ${breakpoints.MD}) {
                padding-bottom: ${({ topComment }): string =>
                    !topComment ? 'calc(var(--safe-area-inset-bottom) + 4.5rem)' : 'initial'};
            }

            .MuiDivider-root#reply {
                flex-grow: 1;
                margin-left: 0.5rem;
            }
        }

        .input-area {
            @media only screen and (min-width: ${breakpoints.MD}) {
                border-top: var(--border);
                padding: ${({ topComment }): string | false => (!!topComment ? '0.5rem 0 0 0' : '0.5rem')};
            }
        }

        #create-comment-button {
            position: fixed;
            bottom: calc(var(--safe-area-inset-bottom) + 3.5rem);
            left: 0;
            right: 0;
            margin-left: auto;
            margin-right: auto;
            opacity: 0.7;
            z-index: 1001;
        }
    }
`;
