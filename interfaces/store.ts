export interface Errors {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  general: string;
  serverNotFound: string;
}

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
  errors: Errors | null;
}

export interface UIState {
  menuOpen: boolean;
}

export interface SearchState {
  results: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  loading: boolean | null;
  errors: Errors | null;
}

export interface State {
  auth: AuthState;
  ui: UIState;
  search: SearchState;
}
