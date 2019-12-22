import { Resource } from './resources';
import { School } from './school';
import { Subject } from './subject';
import { User } from './user';

export interface Course {
  id: number;
  name: string;
  code: string;
  subject: Subject;
  school: School;
  creator: User;
  created: string;
  modified: string;
  resources: Resource[];
  points: number;
}
