import { CommentObjectType } from 'generated/graphql';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDiscussionContext } from 'src/context';

// A custom hook for opening comment modal automatically if a comment has been provided as a query parameter.
export const useCommentQuery = (comments: CommentObjectType[]): void => {
    const { query } = useRouter();
    const { toggleTopComment } = useDiscussionContext();

    useEffect(() => {
        if (query.comment) {
            const comment = comments.find(c => c.id === query.comment);
            comment && toggleTopComment(comment);
        }
    }, []);
};
