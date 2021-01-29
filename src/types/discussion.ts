import { UserObjectType } from 'generated';

export interface CommentTarget {
  course: string | null;
  resource: string | null;
  comment: string | null;
}

export interface CreateCommentFormValues extends CommentTarget {
  user: UserObjectType | null;
  text: string;
  attachment: string | null;
}
