import { combineReducers } from 'redux';
import authReducer from './auth';
import { AuthState, UIState } from './interfaces';
import uiReducer from './ui';

export interface State {
  user: AuthState;
  ui: UIState;
}

export const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer
});
