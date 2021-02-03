import { FormikValues } from 'formik';
import { CommentObjectType } from 'generated';
import { useForm } from 'hooks';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { DiscussionContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const DiscussionContext = createContext<DiscussionContextType>({});

export const useDiscussionContext = <T extends FormikValues>(
  initialCommentCount?: string,
): DiscussionContextType<T> => {
  const discussionContext = useContext(DiscussionContext);

  useEffect(() => {
    !!initialCommentCount && discussionContext.setCommentCount(initialCommentCount);
  }, [initialCommentCount]);

  return discussionContext;
};

export const DiscussionContextProvider: React.FC = ({ children }) => {
  const [comments, setComments] = useState<CommentObjectType[]>([]);
  const [commentCount, setCommentCount] = useState('0');
  const [createCommentDialogOpen, setCreateCommentDialogOpen] = useState(false);
  const [attachmentViewerValue, setAttachmentViewerValue] = useState<string | null>(null); // Attachment of an existing comment.
  const [commentAttachment, setCommentAttachment] = useState<string | ArrayBuffer | null>(null); // Attachment for comment creation form.
  const attachmentInputRef = useRef<HTMLInputElement>(null!);
  const { formRef } = useForm<FormikValues>();

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
