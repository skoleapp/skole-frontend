import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { State } from '../interfaces';
import { initialAuthState, rootReducer } from '../reducers';

const initialState: State = {
  auth: initialAuthState
};

export const initStore = (preloadedState = initialState): Store =>
  createStore(rootReducer, preloadedState, composeWithDevTools(applyMiddleware(thunk)));
