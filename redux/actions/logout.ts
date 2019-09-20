import { Dispatch } from 'redux';
import { LOGOUT } from './types';

export const logout = () => (dispatch: Dispatch): { type: string } => dispatch({ type: LOGOUT });
