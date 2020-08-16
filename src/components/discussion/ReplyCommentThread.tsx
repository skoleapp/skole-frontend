import { Box, Button, Divider, Typography } from '@material-ui/core';
import { useAuthContext, useDeviceContext, useDiscussionContext } from 'context';
import { CommentObjectType, UserObjectType } from 'generated';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React from 'react';

import { CommentCard } from './CommentCard';
import { CreateCommentForm } from './CreateCommentForm';
import { StyledDiscussionBox } from './StyledDiscussionBox';

export const ReplyCommentThread: React.FC = () => {
    const { userMe } = useAuthContext();
    const { t } = useTranslation();
    const isMobile = useDeviceContext();
    const { topComment, toggleTopComment, toggleCommentModal } = useDiscussionContext();
    const replyComments: CommentObjectType[] = R.propOr([], 'replyComments', topComment);
    const target = { comment: Number(R.propOr(undefined, 'id', topComment)) };
    const topCommentUser: UserObjectType = R.propOr(null, 'user', topComment);
    const replyCommentUsers = replyComments.map(c => c.user);
    const openCommentModal = (): void => toggleCommentModal(true);

    // Unique users from comment replies excluding own user.
    const users = [...new Set([topCommentUser, ...replyCommentUsers])].filter(
        u => !!u && !!userMe && u.id !== userMe.id,
    ) as UserObjectType[];

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
        appendComments,
        users,
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
