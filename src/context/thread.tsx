import { FormikProps } from 'formik';
import React, { createContext, useContext, useRef, useState } from 'react';
import { CreateCommentFormValues, ThreadContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const ThreadContext = createContext<ThreadContextType>({});

export const useThreadContext = (): ThreadContextType => useContext(ThreadContext);

export const ThreadContextProvider: React.FC = ({ children }) => {
  const [createCommentDialogOpen, setCreateCommentDialogOpen] = useState(false);
  const [threadImageViewerValue, setThreadImageViewerValue] = useState<string | null>(null); // Image of an existing comment.
  const [commentImageViewerValue, setCommentImageViewerValue] = useState<string | null>(null); // Image of an existing comment.
  const [commentImage, setCommentImage] = useState<string | ArrayBuffer | null>(null); // Comment image preview for comment creation form.
  const [commentFileName, setCommentFileName] = useState(''); // Comment file name preview for comment creation form.
  const formRef = useRef<FormikProps<CreateCommentFormValues>>(null!);

  const value = {
    createCommentDialogOpen,
    setCreateCommentDialogOpen,
    threadImageViewerValue,
    setThreadImageViewerValue,
    commentImageViewerValue,
    setCommentImageViewerValue,
    commentImage,
    commentFileName,
    setCommentImage,
    setCommentFileName,
    formRef,
  };

  return <ThreadContext.Provider value={value}>{children}</ThreadContext.Provider>;
};
