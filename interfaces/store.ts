interface User {
  id: string;
  username: string;
  email: string;
  bio: string;
  points: number;
}

export interface AuthState {
  user: User | null;
  authenticated: boolean;
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
