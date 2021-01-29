import { CommentObjectType } from 'generated';
import React, { createContext, useContext, useState } from 'react';
import { DiscussionContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const DiscussionContext = createContext<DiscussionContextType>({});
export const useDiscussionContext = (): DiscussionContextType => useContext(DiscussionContext);

export const DiscussionContextProvider: React.FC = ({ children }) => {
  const [comments, setComments] = useState<CommentObjectType[]>([]);
  const [commentCount, setCommentCount] = useState('0');
  const [createCommentDialogOpen, setCreateCommentDialogOpen] = useState(false);
  const [attachmentViewerValue, setAttachmentViewerValue] = useState<string | null>(null); // Attachment of an existing comment.
  const [commentAttachment, setCommentAttachment] = useState<string | ArrayBuffer | null>(null); // Attachment for comment creation form.

  const value = {
    comments,
    setComments,
    commentCount,
    setCommentCount,
    createCommentDialogOpen,
    setCreateCommentDialogOpen,
    attachmentViewerValue,
    setAttachmentViewerValue,
    commentAttachment,
    setCommentAttachment,
  };

  return <DiscussionContext.Provider value={value}>{children}</DiscussionContext.Provider>;
};
