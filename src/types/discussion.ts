import { CommentObjectType } from 'generated';

export interface CommentTarget {
  [key: string]: number;
}

export interface TopLevelCommentThreadProps {
  comments: CommentObjectType[];
  target: CommentTarget;
  noComments?: string;
}

export interface CreateCommentFormValues {
  text: string;
  attachment: string | null;
  course?: string;
  resource?: string;
  comment?: string;
}
