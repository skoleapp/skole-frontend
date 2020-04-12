import { combineReducers } from 'redux';

import { resourceReducer as resource } from './resource';

export const rootReducer = combineReducers({ resource });
