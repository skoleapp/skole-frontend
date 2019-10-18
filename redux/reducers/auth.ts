import { AnyAction } from 'redux';
import { AuthState } from '../../interfaces';
import { LOGOUT, SET_USER } from '../actions/types';

export const initialAuthState: AuthState = {
  user: {
    id: null,
    username: null,
    email: null,
    title: null,
    bio: null,
    points: null,
    language: null
  },
  authenticated: null
};

export default (state = initialAuthState, action: AnyAction): AuthState => {
  switch (action.type) {
    case SET_USER: {
      const { id, username, email, title, bio, points, language } = action.payload;

      return {
        ...state,
        authenticated: true,
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
    }

    case LOGOUT:
      return initialAuthState;

    default:
      return state;
  }
};
