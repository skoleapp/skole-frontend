import { Box, Fab } from '@material-ui/core';
import { AddOutlined } from '@material-ui/icons';
import { useAuthContext, useDeviceContext, useDiscussionContext } from 'context';
import { CommentObjectType, UserObjectType } from 'generated';
import React from 'react';
import { TopLevelCommentThreadProps } from 'types';

import { NotFoundBox } from '..';
import { CommentCard } from './CommentCard';
import { CreateCommentForm } from './CreateCommentForm';
import { StyledDiscussionBox } from './StyledDiscussionBox';

export const TopLevelCommentThread: React.FC<TopLevelCommentThreadProps> = ({
    comments: initialComments,
    target,
    placeholderText,
}) => {
    const { topLevelComments, setTopLevelComments, toggleCommentModal } = useDiscussionContext(initialComments);
    const isMobile = useDeviceContext();
    const { userMe } = useAuthContext();

    // Unique users from comment replies excluding own user.
    const topLevelCommentUsers = topLevelComments
        .map(c => c.user)
        .filter(u => !!u && !!userMe && u.id !== userMe.id) as UserObjectType[];

    const users = [...new Set(topLevelCommentUsers)];
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
        users,
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
