export * from './actions';
export * from './reducers';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { rootReducer } from './reducers';

export const initStore = () =>
  createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
