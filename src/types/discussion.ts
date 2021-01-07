import { UserObjectType } from 'generated';

export interface CommentTarget {
  [key: string]: number;
}

export interface TopLevelCommentThreadProps {
  target: CommentTarget;
  noComments?: string;
}

export interface CreateCommentFormValues {
  user: UserObjectType | null;
  text: string;
  attachment: string | null;
  course?: string;
  resource?: string;
  comment?: string;
}
