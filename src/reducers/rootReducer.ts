import { combineReducers } from 'redux';
import { authReducer as auth } from './auth';
import { notificationReducer as notification } from './notification';

export const rootReducer = combineReducers({
  auth,
  notification
});
