import { authReducer as auth } from './auth';
import { combineReducers } from 'redux';
import { notificationReducer as notification } from './notification';

export const rootReducer = combineReducers({
    auth,
    notification,
});
