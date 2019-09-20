export interface User {
  id: string | null;
  username: string | null;
  email: string | null;
  title: string | null;
  bio: string | null;
  points: number | null;
  language: string | null;
}

export interface AuthState {
  user: User;
  authenticated: boolean | null;
  token: string | null;
  loading: boolean | null;
  error: string | null;
}

export interface UIState {
  menuOpen: boolean;
}

export interface State {
  auth: AuthState;
  ui: UIState;
}
