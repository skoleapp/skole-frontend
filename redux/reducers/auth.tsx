import { AnyAction } from 'redux';
import { AuthState } from '../../interfaces';
import {
  GET_USER,
  GET_USER_ERROR,
  GET_USER_SUCCESS,
  LOGIN_USER,
  LOGIN_USER_ERROR,
  LOGIN_USER_SUCCESS,
  LOGOUT,
  REGISTER_USER,
  REGISTER_USER_ERROR,
  REGISTER_USER_SUCCESS
} from '../actions/types';

const initialState: AuthState = {
  user: null,
  authenticated: null,
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
      return { ...state, authenticated: true, loading: false };

    case LOGOUT:
      return { ...state, authenticated: false };

    case LOGIN_USER_ERROR:
    case REGISTER_USER_ERROR:
    case GET_USER_ERROR:
      return { ...state, error: action.payload, authenticated: false, loading: false };

    default:
      return state;
  }
};
