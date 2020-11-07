import { CommentObjectType } from 'generated';
import Router from 'next/router';
import React, { createContext, useEffect, useState } from 'react';
import { useContext } from 'react';
import { DiscussionContextType } from 'types';

// Ignore: Initialize context with empty object rather than populating it with placeholder values.
// @ts-ignore
const DiscussionContext = createContext<DiscussionContextType>({});

interface UseDiscussionContext extends DiscussionContextType {
    commentCount: number;
}

export const useDiscussionContext = (initialComments: CommentObjectType[] = []): UseDiscussionContext => {
    const { topLevelComments: contextTopLevelComments, setTopLevelComments, ...discussionContext } = useContext(
        DiscussionContext,
    );

    const topLevelComments: CommentObjectType[] =
        !!contextTopLevelComments && !!contextTopLevelComments.length ? contextTopLevelComments : initialComments || [];

    const commentCount =
        topLevelComments.length + topLevelComments.reduce((acc, cur) => acc + cur.replyComments.length, 0);

    return { topLevelComments, setTopLevelComments, commentCount, ...discussionContext };
};

export const DiscussionContextProvider: React.FC = ({ children }) => {
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const toggleCommentModal = (payload: boolean): void => setCommentModalOpen(payload);
    const [topLevelComments, setTopLevelComments] = useState<CommentObjectType[]>([]); // List of top-level comments on a course/resource.
    const [topComment, setTopComment] = useState<CommentObjectType | null>(null); // Top comment that starts a thread of reply comments.
    const toggleTopComment = (payload: CommentObjectType | null): void => setTopComment(payload);
    const [attachmentViewerValue, setAttachmentViewerValue] = useState<string | null>(null); // Attachment of an existing comment.
    const [commentAttachment, setCommentAttachment] = useState<string | ArrayBuffer | null>(null); // Attachment for comment creation form.

    // Reset the top level comments when changing routes.
    // This is a potential fix for: https://trello.com/c/I2npl2pi/497-discussion-tab-content-not-refreshed-after-switching-to-a-resource-or-another-course
    // TODO: If this will not fix the issue, remove this.
    useEffect(() => {
        Router.events.on('routeChangeComplete', () => setTopLevelComments([]));
    }, []);

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

    return <DiscussionContext.Provider value={value}>{children}</DiscussionContext.Provider>;
};
