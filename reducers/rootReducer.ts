import { combineReducers } from 'redux';
import { authReducer as auth } from './auth';
import { notificationReducer as notifications } from './notifications';

export const rootReducer = combineReducers({
  auth,
  notifications
});
