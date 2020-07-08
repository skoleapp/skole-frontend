import { Box, Button, Divider, Fab, Typography } from '@material-ui/core';
import { AddOutlined } from '@material-ui/icons';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { CommentObjectType } from '../../../generated/graphql';
import { useCommentModalContext, useDeviceContext, useDiscussionContext } from '../../context';
import { breakpoints } from '../../styles';
import { TopLevelCommentThreadProps } from '../../types';
import { CommentCard } from './CommentCard';
import { CreateCommentForm } from './CreateCommentForm';
import { NotFoundBox } from './NotFoundBox';

export const TopLevelCommentThread: React.FC<TopLevelCommentThreadProps> = ({
    comments: initialComments,
    target,
    formKey,
    placeholderText,
}) => {
    const { topLevelComments, setTopLevelComments } = useDiscussionContext(initialComments);
    const isMobile = useDeviceContext();
    const { toggleCommentModal } = useCommentModalContext();
    const appendComments = (comment: CommentObjectType): void => setTopLevelComments([...topLevelComments, comment]);
    const openCommentModal = (): void => toggleCommentModal(true);
    const removeComment = (id: string): void => setTopLevelComments(topLevelComments.filter(c => c.id !== id));

    const commentCardProps = {
        isThread: false,
        removeComment,
    };

    const createCommentFormProps = {
        target,
        appendComments,
        formKey,
    };

    const renderTopLevelComments = !!topLevelComments.length
        ? topLevelComments.map((c, i) => (
              <Box key={i}>
                  <CommentCard {...commentCardProps} comment={c} />
              </Box>
          ))
        : !!placeholderText && <NotFoundBox text={placeholderText} />;

    const renderMessageArea = <Box className="message-area">{renderTopLevelComments}</Box>;

    const renderInputArea = (
        <Box className="input-area">
            <CreateCommentForm {...createCommentFormProps} />
        </Box>
    );

    const renderCreateCommentButton = isMobile && (
        <Fab id="create-comment-button" color="secondary" onClick={openCommentModal}>
            <AddOutlined />
        </Fab>
    );

    return (
        <StyledDiscussionBox>
            <Box className="discussion-container">
                {renderMessageArea}
                {renderInputArea}
                {renderCreateCommentButton}
            </Box>
        </StyledDiscussionBox>
    );
};

export const ReplyCommentThread: React.FC = () => {
    const { t } = useTranslation();
    const isMobile = useDeviceContext();
    const { topComment, toggleTopComment } = useDiscussionContext();
    const replyComments: CommentObjectType[] = R.propOr([], 'replyComments', topComment);
    const { toggleCommentModal } = useCommentModalContext();
    const target = { comment: Number(R.propOr(undefined, 'id', topComment)) };
    const openCommentModal = (): void => toggleCommentModal(true);

    const appendComments = (comment: CommentObjectType): void => {
        if (!!topComment) {
            toggleTopComment({
                ...topComment,
                replyComments: [...topComment.replyComments, comment],
            });
        }
    };

    const removeComment = (id: string): void => {
        if (!!topComment) {
            if (id === topComment.id) {
                toggleTopComment(null); // Close modal if top comment gets deleted.
            } else {
                const filteredReplyComments: CommentObjectType[] = replyComments.filter(c => c.id !== id);
                toggleTopComment({ ...topComment, replyComments: filteredReplyComments });
            }
        }
    };

    const commentCardProps = {
        isThread: true,
        removeComment,
    };

    const createCommentFormProps = {
        target,
        formKey: 'comment-thread',
        appendComments,
    };

    const renderTopComment = !!topComment && (
        <>
            <CommentCard {...commentCardProps} comment={topComment} disableBorder />
            <Box padding="0.25rem 0.5rem" display="flex" alignItems="center">
                <Typography variant="body2" color="textSecondary">
                    {replyComments.length} replies
                </Typography>
                <Divider id="reply" />
            </Box>
        </>
    );

    const renderReplyComments =
        !!replyComments.length &&
        replyComments.map((c, i) => (
            <Box key={i}>
                <CommentCard {...commentCardProps} comment={c} />
            </Box>
        ));

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
            {renderReplyComments}
            {renderReplyButton}
        </Box>
    );

    const renderInputArea = (
        <Box className="input-area">
            <CreateCommentForm {...createCommentFormProps} />
        </Box>
    );

    return (
        <StyledDiscussionBox topComment={topComment}>
            <Box className="discussion-container">
                {renderMessageArea}
                {renderInputArea}
            </Box>
        </StyledDiscussionBox>
    );
};

// Ignore: topComment must be omitted from Box props.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StyledDiscussionBox = styled(({ topComment, ...other }) => <Box {...other} />)`
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
