import { CommentObjectType } from 'generated';
import React, { createContext, useState } from 'react';
import { useContext } from 'react';
import { DiscussionContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const DiscussionContext = createContext<DiscussionContextType>({});

interface UseDiscussionContext extends DiscussionContextType {
  commentCount: number;
}

export const useDiscussionContext = (
  initialComments: CommentObjectType[] = [],
): UseDiscussionContext => {
  const {
    topLevelComments: contextTopLevelComments,
    setTopLevelComments,
    ...discussionContext
  } = useContext(DiscussionContext);

  const topLevelComments: CommentObjectType[] =
    !!contextTopLevelComments && !!contextTopLevelComments.length
      ? contextTopLevelComments
      : initialComments || [];

  const commentCount =
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

  const toggleCommentModal = (payload: boolean): void =>
    setCommentModalOpen(payload);

  // List of top-level comments on a course/resource.
  const [topLevelComments, setTopLevelComments] = useState<CommentObjectType[]>(
    [],
  );

  const [topComment, setTopComment] = useState<CommentObjectType | null>(null); // Top comment that starts a thread of reply comments.

  const toggleTopComment = (payload: CommentObjectType | null): void =>
    setTopComment(payload);

  // Attachment of an existing comment.
  const [attachmentViewerValue, setAttachmentViewerValue] = useState<
    string | null
  >(null);

  // Attachment for comment creation form.
  const [commentAttachment, setCommentAttachment] = useState<
    string | ArrayBuffer | null
  >(null);

  const value = {
    commentModalOpen,
    toggleCommentModal,
    topLevelComments,
    setTopLevelComments,
    topComment,
    toggleTopComment,
    attachmentViewerValue,
    setAttachmentViewerValue,
    commentAttachment,
    setCommentAttachment,
  };

  return (
    <DiscussionContext.Provider value={value}>
      {children}
    </DiscussionContext.Provider>
  );
};
