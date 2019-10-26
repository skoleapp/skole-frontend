import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { State } from '../interfaces';
import { initialAuthState, initialUIState, rootReducer } from '../reducers';

const initialState: State = {
  auth: initialAuthState,
  ui: initialUIState
};

export const initStore = (preloadedState = initialState): Store =>
  createStore(rootReducer, preloadedState, composeWithDevTools(applyMiddleware(thunk)));
