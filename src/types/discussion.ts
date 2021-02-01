import {
  CommentObjectType,
  CourseObjectType,
  ResourceObjectType,
  SchoolObjectType,
  UserObjectType,
} from 'generated';

export interface CreateCommentFormValues {
  user: UserObjectType | null;
  text: string;
  attachment: string | null;
  course: CourseObjectType | null;
  resource: ResourceObjectType | null;
  comment: CommentObjectType | null;
  school: SchoolObjectType | null;
}
