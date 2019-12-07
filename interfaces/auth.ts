export interface UserMe {
  id: string | null;
  username: string | null;
  email: string | null;
  title: string | null;
  bio: string | null;
  avatar: string | null;
  points: number | null;
}

export interface Auth {
  user: UserMe;
  authenticated: boolean | null;
  loading: boolean | null;
  error: string | null;
}
