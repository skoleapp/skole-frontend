import { Course } from './course';
import { Subject } from './subject';

export interface SchoolType {
  name: string;
}

export interface School {
  id: string;
  schoolType: string;
  name: string;
  city: string;
  country: string;
  subjects: Subject[];
  courses: Course[];
}
