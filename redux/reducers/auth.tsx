import { AnyAction } from 'redux';
import { LOGIN } from '../actions/types';

interface AuthState {
  user: string | null;
  token: string | null;
  loading: boolean | null;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: null,
  error: null
};

export default (state = initialState, action: AnyAction): AuthState => {
  switch (action.type) {
    case LOGIN:
      return { ...state, token: action.payload };
    default:
      return state;
  }
};
