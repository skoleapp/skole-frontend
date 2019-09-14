import { AnyAction } from 'redux';
import { AuthState } from '../../interfaces';
import {
  GET_USER,
  GET_USER_ERROR,
  LOGIN,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  LOGOUT,
  REFRESH_TOKEN,
  REFRESH_TOKEN_SUCCESS,
  REGISTER,
  REGISTER_ERROR,
  REGISTER_SUCCESS
} from '../actions/types';

const initialState: AuthState = {
  user: null,
  authenticated: false,
  loading: null,
  error: null
};

export default (state = initialState, action: AnyAction): AuthState => {
  switch (action.type) {
    case REGISTER:
    case GET_USER:
    case LOGIN:
    case REFRESH_TOKEN:
      return { ...state, loading: true };

    case LOGIN_SUCCESS:
    case REFRESH_TOKEN_SUCCESS:
      localStorage.setItem('token', action.payload);
      return { ...state, authenticated: true, loading: false };

    case LOGOUT:
      localStorage.removeItem('token');
      return { ...state, authenticated: false };

    case REGISTER_SUCCESS:
      return { ...state, authenticated: false, loading: false };

    case LOGIN_ERROR:
    case REGISTER_ERROR:
    case GET_USER_ERROR:
      return { ...state, error: action.payload, authenticated: false, loading: false };

    default:
      return state;
  }
};
