import { AnyAction, Dispatch } from 'redux';
import { TOGGLE_MENU } from './types';

export const toggleMenu = () => (dispatch: Dispatch<AnyAction>) => {
  return dispatch({ type: TOGGLE_MENU });
};
