import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import { rootReducer } from './reducers';
const storage = require('redux-persist/lib/storage').default;

export const initStore = (): Store => {
  let store: any; // eslint-disable-line
  const isServer = typeof window === 'undefined';

  if (!isServer) {
    const persistConfig = {
      key: 'root',
      storage
    };

    store = createStore(
      persistReducer(persistConfig, rootReducer),
      composeWithDevTools(applyMiddleware(thunk))
    );

    store.__PERSISTOR = persistStore(store);
  } else {
    store = createStore(rootReducer, applyMiddleware(thunk));
  }

  return store;
};
