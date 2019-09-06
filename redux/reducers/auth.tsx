import { AnyAction } from 'redux';
import {
  GET_USER,
  GET_USER_ERROR,
  GET_USER_SUCCESS,
  LOGIN_USER,
  LOGIN_USER_ERROR,
  LOGIN_USER_SUCCESS,
  REGISTER_USER,
  REGISTER_USER_ERROR,
  REGISTER_USER_SUCCESS
} from '../actions/types';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean | null;
  loading: boolean | null;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoggedIn: null,
  loading: null,
  error: null
};

export default (state = initialState, action: AnyAction): AuthState => {
  switch (action.type) {
    case LOGIN_USER:
    case REGISTER_USER:
    case GET_USER:
      return { ...state, loading: true };
    case LOGIN_USER_SUCCESS:
    case REGISTER_USER_SUCCESS:
    case GET_USER_SUCCESS:
      return { ...state, token: action.payload, loading: false };
    case LOGIN_USER_ERROR:
    case REGISTER_USER_ERROR:
    case GET_USER_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};
