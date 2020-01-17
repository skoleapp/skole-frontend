import { authReducer as auth } from './auth';
import { combineReducers } from 'redux';
import { notificationReducer as notification } from './notification';
import { settingsReducer as settings } from './settings';

export const rootReducer = combineReducers({
    auth,
    notification,
    settings,
});
