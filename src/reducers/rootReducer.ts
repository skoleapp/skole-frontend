import { combineReducers } from 'redux';

import { resourceReducer as resource } from './resource';
import { uiReducer as ui } from './ui';

export const rootReducer = combineReducers({ ui, resource });
