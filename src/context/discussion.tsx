import { CommentObjectType } from 'generated';
import React, { createContext, useState, useContext } from 'react';

import { DiscussionContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const DiscussionContext = createContext<DiscussionContextType>({});

interface UseDiscussionContext extends DiscussionContextType {
  commentCount: number;
}

export const useDiscussionContext = (): UseDiscussionContext => {
  const { topLevelComments, setTopLevelComments, ...discussionContext } = useContext(
    DiscussionContext,
  );

  const commentCount =
    !!topLevelComments &&
    topLevelComments.length +
      topLevelComments.reduce((acc, cur) => acc + cur.replyComments.length, 0);

  return {
    topLevelComments,
    setTopLevelComments,
    commentCount,
    ...discussionContext,
  };
};

export const DiscussionContextProvider: React.FC = ({ children }) => {
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const toggleCommentModal = (payload: boolean): void => setCommentModalOpen(payload);
  const [topLevelComments, setTopLevelComments] = useState<CommentObjectType[]>([]); // List of top-level comments on a course/resource.
  const [topComment, setTopComment] = useState<CommentObjectType | null>(null); // Top comment that starts a thread of reply comments.
  const [attachmentViewerValue, setAttachmentViewerValue] = useState<string | null>(null); // Attachment of an existing comment.
  const [commentAttachment, setCommentAttachment] = useState<string | ArrayBuffer | null>(null); // Attachment for comment creation form.

  const value = {
    commentModalOpen,
    toggleCommentModal,
    topLevelComments,
    setTopLevelComments,
    topComment,
    setTopComment,
    attachmentViewerValue,
    setAttachmentViewerValue,
    commentAttachment,
    setCommentAttachment,
  };

  return <DiscussionContext.Provider value={value}>{children}</DiscussionContext.Provider>;
};
