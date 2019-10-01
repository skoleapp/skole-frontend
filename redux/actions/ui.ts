import { AnyAction, Dispatch } from 'redux';
import { CLOSE_WIDGETS, TOGGLE_DESKTOP_MENU_DROPDOWN, TOGGLE_MENU } from './types';

export const toggleMenu = (open: boolean) => (dispatch: Dispatch<AnyAction>): void => {
  dispatch({ type: TOGGLE_MENU, payload: open });
};

export const toggleDesktopMenuDropdown = (open: boolean) => (
  dispatch: Dispatch<AnyAction>
): void => {
  dispatch({ type: TOGGLE_DESKTOP_MENU_DROPDOWN, payload: open });
};

export const closeWidgets = () => (dispatch: Dispatch): void => {
  dispatch({ type: CLOSE_WIDGETS });
};
