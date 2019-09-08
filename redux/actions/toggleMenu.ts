import { AnyAction, Dispatch } from 'redux';
import { TOGGLE_MENU } from './types';

export type toggleMenuReturnType = {
  type: string;
};

export const toggleMenu = () => (dispatch: Dispatch<AnyAction>): toggleMenuReturnType => {
  return dispatch({ type: TOGGLE_MENU });
};
