export interface PublicUser {
  id: string;
  username: string;
  title: string | null;
  bio: string | null;
  avatar: string;
  points: number;
  courses: number;
  resources: number;
}
