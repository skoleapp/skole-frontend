import { CommentObjectType } from 'generated';

export interface CommentTarget {
    [key: string]: number;
}

export interface TopLevelCommentThreadProps {
    comments: CommentObjectType[];
    target: CommentTarget;
    formKey: string;
    placeholderText?: string;
}
