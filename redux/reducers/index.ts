import { combineReducers } from 'redux';
import authReducer from './auth';
import { AuthState } from './interfaces';

export interface State {
  user: AuthState
} 

export const rootReducer = combineReducers({
  auth: authReducer
});
