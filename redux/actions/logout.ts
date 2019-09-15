import { Dispatch } from 'redux';
import { LOGOUT } from './types';

export const logout = () => (dispatch: Dispatch): void => {
  dispatch({ type: LOGOUT });
};
