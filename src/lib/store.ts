import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { rootReducer } from '../reducers';

export const initStore = (preloadedState = {}): Store => {
    return createStore(rootReducer, preloadedState, composeWithDevTools(applyMiddleware(thunk)));
};
