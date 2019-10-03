import { AnyAction } from 'redux';
import { UIState } from '../../interfaces';
import {
  CLOSE_WIDGETS,
  TOGGLE_DESKTOP_MENU_DROPDOWN,
  TOGGLE_MENU,
  TOGGLE_SEARCH_INPUT
} from '../actions/types';

const initialState: UIState = {
  menuOpen: false,
  authMenuOpen: false,
  searchInputOpen: false
};

export default (state = initialState, action: AnyAction): UIState => {
  switch (action.type) {
    case TOGGLE_MENU:
      return { ...state, menuOpen: action.payload };
    case TOGGLE_DESKTOP_MENU_DROPDOWN:
      return { ...state, authMenuOpen: action.payload };
    case CLOSE_WIDGETS:
      return { ...initialState };
    case TOGGLE_SEARCH_INPUT:
      return { ...state, searchInputOpen: action.payload };
    default:
      return state;
  }
};
