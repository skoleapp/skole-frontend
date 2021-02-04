import { CourseObjectType, SchoolObjectType } from 'generated';

export type SecondaryDiscussion = CourseObjectType | SchoolObjectType | null;

export enum DiscussionTypes {
  COURSE = 'course',
  RESOURCE = 'resource',
  SCHOOL = 'school',
}
