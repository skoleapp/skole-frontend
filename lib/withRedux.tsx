import App from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { SkoleContext, State } from '../interfaces';
import { initStore } from './store';

/* eslint-disable */
export const withRedux = (PageComponent: any, { ssr = true } = {}): any => {
  const WithRedux = ({ initialReduxState, ...props }: any): any => {
    const store = getOrInitStore(initialReduxState);
    /* eslint-enable */
    return (
      <Provider store={store}>
        <PageComponent {...props} />
      </Provider>
    );
  };

  if (process.env.NODE_ENV !== 'production') {
    const isAppHoc = PageComponent === App || PageComponent.prototype instanceof App;
    if (isAppHoc) {
      throw new Error('The withRedux HOC only works with PageComponents');
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    const displayName = PageComponent.displayName || PageComponent.name || 'Component';

    WithRedux.displayName = `withRedux(${displayName})`;
  }

  if (ssr || PageComponent.getInitialProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    WithRedux.getInitialProps = async (context: SkoleContext): Promise<any> => {
      const reduxStore = getOrInitStore(); // eslint-disable-line @typescript-eslint/no-use-before-define
      context.reduxStore = reduxStore;

      const pageProps =
        typeof PageComponent.getInitialProps === 'function'
          ? await PageComponent.getInitialProps(context)
          : {};

      return {
        ...pageProps,
        initialReduxState: reduxStore.getState()
      };
    };
  }

  return WithRedux;
};

let reduxStore: Store;

const getOrInitStore = (initialState?: State): Store => {
  // Always make a new store if server, otherwise state is shared between requests
  if (typeof window === 'undefined') {
    return initStore(initialState);
  }

  // Create store if unavailable on the client and set it on the window object
  if (!reduxStore) {
    reduxStore = initStore(initialState);
  }

  return reduxStore;
};
