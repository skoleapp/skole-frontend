import { FormikProps, FormikValues } from 'formik';
import { CommentObjectType } from 'generated';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { DiscussionContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const DiscussionContext = createContext<DiscussionContextType>({});

export const useDiscussionContext = <T extends FormikValues>(
  initialCommentCount?: string,
): DiscussionContextType<T> => {
  const discussionContext = useContext(DiscussionContext);

  useEffect(() => {
    if (initialCommentCount) {
      discussionContext.setCommentCount(initialCommentCount);
    }
  }, [initialCommentCount, discussionContext]);

  return discussionContext;
};

export const DiscussionContextProvider: React.FC = ({ children }) => {
  const [comments, setComments] = useState<CommentObjectType[]>([]);
  const [commentCount, setCommentCount] = useState('0');
  const [createCommentDialogOpen, setCreateCommentDialogOpen] = useState(false);
  const [attachmentViewerValue, setAttachmentViewerValue] = useState<string | null>(null); // Attachment of an existing comment.
  const [commentAttachment, setCommentAttachment] = useState<string | ArrayBuffer | null>(null); // Attachment for comment creation form.
  const attachmentInputRef = useRef<HTMLInputElement>(null!);
  const formRef = useRef<FormikProps<FormikValues>>(null!);

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
    attachmentInputRef,
    formRef,
  };

  return <DiscussionContext.Provider value={value}>{children}</DiscussionContext.Provider>;
};
