import { combineReducers } from 'redux';

import { authReducer as auth } from './auth';
import { resourceReducer as resource } from './resource';
import { uiReducer as ui } from './ui';

export const rootReducer = combineReducers({
    auth,
    ui,
    resource,
});
