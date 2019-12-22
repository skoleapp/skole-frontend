import { Course } from './course';
import { Resource } from './resources';

export interface User {
  id: string;
  username: string;
  email: string | null;
  title: string | null;
  bio: string | null;
  avatar: string;
  avatarThumbnail: string;
  points: number;
  courseCount: number;
  resourceCount: number;
  courses?: Course[];
  resources?: Resource[];
}
