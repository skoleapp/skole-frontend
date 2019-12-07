import { Course } from './course';
import { PublicUser } from './user';

export interface ResourceType {
  name: string;
}

export interface Resource {
  resourceType: string;
  title: string;
  file: string;
  date: string;
  course: Course;
  creator: PublicUser;
  points: number;
  modified: string;
  created: string;
}
