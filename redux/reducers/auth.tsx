import { AnyAction } from 'redux';
import { LOGIN_USER, LOGIN_USER_ERROR, LOGIN_USER_SUCCESS } from '../actions/types';

interface AuthState {
  user: string | null;
  token: string | null;
  loading: boolean | null;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: null,
  error: null
};

export default (state = initialState, action: AnyAction): AuthState => {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loading: true };
    case LOGIN_USER_SUCCESS:
      return { ...state, token: action.payload, loading: false };
    case LOGIN_USER_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};
