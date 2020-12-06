import { FormikProps } from 'formik';
import { CommentObjectType, UserObjectType } from 'generated';

export interface CommentTarget {
  [key: string]: number;
}

export interface TopLevelCommentThreadProps {
  comments: CommentObjectType[];
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

export interface RichTextEditorProps extends FormikProps<CreateCommentFormValues> {
  enableAuthorSelection?: boolean;
}
