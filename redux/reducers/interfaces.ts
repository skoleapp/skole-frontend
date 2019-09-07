interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean | null;
  loading: boolean | null;
  error: string | null;
}

export interface UIState {
  menuOpen: boolean;
}
