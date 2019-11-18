import { School } from './school';
import { Subject } from './subject';
import { PublicUser } from './user';

export interface Course {
  id: number;
  name: string;
  code: string;
  subject: Subject;
  school: School;
  creator: PublicUser;
  created: string;
  modified: string;
}
