import { CommentObjectType } from 'generated';
import React, { Context, createContext, useState } from 'react';
import { useContext } from 'react';
import { DiscussionContextType } from 'types';

const DiscussionContext = createContext<DiscussionContextType | null>(null);

interface UseDiscussionContext extends DiscussionContextType {
    commentCount: number;
}

export const useDiscussionContext = (initialComments: CommentObjectType[] = []): UseDiscussionContext => {
    const { topLevelComments: contextTopLevelComments, setTopLevelComments, ...discussionContext } = useContext(
        DiscussionContext as Context<DiscussionContextType>,
    );

    const topLevelComments: CommentObjectType[] = !!contextTopLevelComments.length
        ? contextTopLevelComments
        : initialComments || [];

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
