import { Course } from './course';
import { User } from './user';

export interface ResourceType {
  id: string;
  name: string;
}

export interface Resource {
  id: string;
  resourceType: string;
  title: string;
  file: string;
  date: string;
  course: Course;
  creator: User;
  points: number;
  modified: string;
  created: string;
}
