import { AnyAction } from 'redux';
import {
  GET_USER_ME_ERROR,
  GET_USER_ME_LOADING,
  GET_USER_ME_SUCCESS,
  LOGIN,
  LOGOUT,
  UPDATE_USER_ME
} from '../actions';
import { Auth } from '../interfaces';

export const initialState: Auth = {
  user: {
    id: null,
    username: null,
    email: null,
    title: null,
    bio: null,
    avatar: null,
    points: null
  },
  authenticated: null,
  loading: null,
  error: null
};

export const authReducer = (state = initialState, action: AnyAction): Auth => {
  switch (action.type) {
    case GET_USER_ME_LOADING: {
      return { ...state, loading: true };
    }

    case GET_USER_ME_SUCCESS:
    case UPDATE_USER_ME:
    case LOGIN: {
      const { id, username, email, title, bio, avatar, points } = action.payload;

      return {
        ...state,
        authenticated: true,
        loading: false,
        user: {
          id,
          username,
          email,
          title,
          bio,
          avatar,
          points
        }
      };
    }

    case LOGOUT: {
      return initialState;
    }

    case GET_USER_ME_ERROR: {
      return { ...state, loading: false, error: action.payload };
    }

    default:
      return state;
  }
};
