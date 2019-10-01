import { AnyAction } from 'redux';
import { UIState } from '../../interfaces';
import { CLOSE_WIDGETS, TOGGLE_DESKTOP_MENU_DROPDOWN, TOGGLE_MENU } from '../actions/types';

const initialState: UIState = {
  menuOpen: false,
  desktopMenuDropdownOpen: false
};

export default (state = initialState, action: AnyAction): UIState => {
  switch (action.type) {
    case TOGGLE_MENU:
      return { ...state, menuOpen: action.payload };
    case TOGGLE_DESKTOP_MENU_DROPDOWN:
      return { ...state, desktopMenuDropdownOpen: action.payload };
    case CLOSE_WIDGETS:
      return { ...initialState };
    default:
      return state;
  }
};
