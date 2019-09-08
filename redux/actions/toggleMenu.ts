import { AnyAction, Dispatch } from 'redux';
import { TOGGLE_MENU } from './types';

export const toggleMenu = (open: boolean) => (dispatch: Dispatch<AnyAction>): void => {
  dispatch({ type: TOGGLE_MENU, payload: open });
};
