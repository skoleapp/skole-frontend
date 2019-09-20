import { AnyAction } from 'redux';
import { AuthState } from '../../interfaces';
import {
  GET_USER_ME,
  GET_USER_ME_ERROR,
  GET_USER_ME_SUCCESS,
  LOGIN,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  LOGOUT,
  REFRESH_TOKEN,
  REFRESH_TOKEN_ERROR,
  REFRESH_TOKEN_SUCCESS,
  REGISTER,
  REGISTER_ERROR,
  SET_TOKEN
} from '../actions/types';

const initialState: AuthState = {
  user: {
    id: null,
    username: null,
    email: null,
    title: null,
    bio: null,
    points: null,
    language: null
  },
  authenticated: null,
  token: null,
  loading: null,
  error: null
};

export default (state = initialState, action: AnyAction): AuthState => {
  switch (action.type) {
    case REGISTER:
    case LOGIN:
    case REFRESH_TOKEN:
    case GET_USER_ME:
      return { ...state, loading: true };

    case SET_TOKEN:
      return { ...state, token: action.payload };

    case LOGIN_SUCCESS:
    case REFRESH_TOKEN_SUCCESS:
      localStorage.setItem('token', action.payload);
      return { ...state, authenticated: true, token: action.payload, loading: false };

    case LOGOUT:
      localStorage.removeItem('token');
      return { ...initialState };

    case GET_USER_ME_SUCCESS:
      const { id, username, email, title, bio, points, language } = action.payload;

      return {
        ...state,
        loading: false,
        user: {
          id,
          username,
          email,
          title,
          bio,
          points,
          language
        }
      };

    case LOGIN_ERROR:
    case REGISTER_ERROR:
    case GET_USER_ME_ERROR:
    case REFRESH_TOKEN_ERROR:
      return { ...state, error: action.payload, authenticated: false, loading: false };

    default:
      return state;
  }
};
