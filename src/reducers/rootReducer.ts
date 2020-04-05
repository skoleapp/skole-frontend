import { combineReducers } from 'redux';

import { uiReducer as ui } from './ui';

export const rootReducer = combineReducers({ ui });
