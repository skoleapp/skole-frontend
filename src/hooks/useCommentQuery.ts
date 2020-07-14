import { useDiscussionContext } from 'context';
import { CommentObjectType } from 'generated';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// A custom hook for opening comment modal automatically if a comment has been provided as a query parameter.
export const useCommentQuery = (comments: CommentObjectType[]): void => {
    const { query } = useRouter();
    const { toggleTopComment } = useDiscussionContext();

    useEffect(() => {
        if (query.comment) {
            const comment = comments.find(c => c.id === query.comment);

            if (!!comment) {
                toggleTopComment(comment); // Query is  a top level comment.
            } else {
                // Query is a reply comment. We find it's top level comment.
                const comment = comments.find(c => c.replyComments.some(r => r.id === query.comment));
                !!comment && toggleTopComment(comment);
            }
        }
    }, []);
};
