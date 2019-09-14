import { Dispatch } from 'redux';
import { LOGOUT } from './types';

export const logout = () => (dispatch: Dispatch) => dispatch({ type: LOGOUT });
