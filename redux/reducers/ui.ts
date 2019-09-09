import { AnyAction } from 'redux';
import { TOGGLE_MENU } from '../actions/types';
import { UIState } from './interfaces';

const initialState: UIState = {
  menuOpen: false
};

export default (state = initialState, action: AnyAction): UIState => {
  switch (action.type) {
    case TOGGLE_MENU:
      return { menuOpen: action.payload };
    default:
      return state;
  }
};
