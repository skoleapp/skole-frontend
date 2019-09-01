import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './reducers';

const initStore = (initialState = {}): any => {
  return createStore(rootReducer, initialState, applyMiddleware(thunk));
};
export default initStore;
