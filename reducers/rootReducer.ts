import { combineReducers } from 'redux';
import authReducer from './auth';
import uiReducer from './ui';
import schoolListing from './schoolListing';

export const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  schoolListing
});
