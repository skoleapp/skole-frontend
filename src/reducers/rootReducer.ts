import { combineReducers } from 'redux';

import { authReducer as auth } from './auth';
import { uiReducer as ui } from './ui';
import { resourceReducer as resource } from './resource';

export const rootReducer = combineReducers({
    auth,
    ui,
    resource,
});
