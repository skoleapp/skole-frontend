import { Course } from './course';
import { Subject } from './subject';

export interface School {
  id: number;
  schoolType: string;
  name: string;
  city: string;
  country: string;
  subjects: Subject[] | null;
  courses: Course[] | null;
}
