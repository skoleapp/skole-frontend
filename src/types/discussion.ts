import { CommentObjectType } from 'generated';

export interface CommentTarget {
    [key: string]: number;
}

export interface TopLevelCommentThreadProps {
    comments: CommentObjectType[];
    target: CommentTarget;
    placeholderText?: string;
}

export interface CreateCommentFormValues {
    text: string;
    attachment: File | null;
    course?: string;
    resource?: string;
    comment?: string;
}
