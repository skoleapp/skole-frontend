import { combineReducers } from 'redux';
import authReducer from './auth';
import searchReducer from './search';
import uiReducer from './ui';

export const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  search: searchReducer
});
