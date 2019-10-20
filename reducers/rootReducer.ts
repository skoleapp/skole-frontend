import { combineReducers } from 'redux';
import authReducer from './auth';
import uiReducer from './ui';

export const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer
});
