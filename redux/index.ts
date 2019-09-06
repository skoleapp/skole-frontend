export * from './actions';
export * from './reducers';
import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { rootReducer } from './reducers';

export const initStore = (): Store =>
  createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
