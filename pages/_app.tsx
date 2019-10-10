import { NextPage, NextPageContext } from 'next';
import withRedux from 'next-redux-wrapper';
import { AppContext } from 'next/app';
import { AppContextType } from 'next/dist/next-server/lib/utils';
import Router, { Router as RouterType } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { LoadingScreen } from '../components/layout';
import { initStore } from '../redux';
import '../styles';

interface StatelessPage<P = {}> extends React.FC<P> {
  getInitialProps?: ({ Component, ctx }: AppContextType<RouterType>) => Promise<{ pageProps: {} }>;
}
interface Props {
  store: Store;
  Component: NextPage<any>; // eslint-disable-line
  pageProps: NextPageContext;
}

export const AppProvider: StatelessPage<Props> = ({ store, Component, pageProps }: Props) => {
  const [redirect, setRedirect] = useState(false);

  // FIXME: these are causing memory leaks
  Router.events.on('routeChangeStart', () => setRedirect(true));
  Router.events.on('routeChangeComplete', () => setRedirect(false));
  Router.events.on('routeChangeError', () => setRedirect(false));

  const setTokenAsynchronously = async (): Promise<void> => {
    const { token } = await store.getState().auth;
    await localStorage.setItem('token', token);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem('token');
    // token && store.dispatch(refreshToken(token));

    // Only persist the correct token in local storage when demounting
    return (): void => {
      setTokenAsynchronously();
    };
  }, []);

  if (redirect) {
    return <LoadingScreen />;
  }

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

// eslint-disable-next-line
AppProvider.getInitialProps = async ({ Component, ctx }: AppContext): Promise<any> => {
  return {
    pageProps: {
      ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})
    }
  };
};

export default withRedux(initStore, { debug: false })(AppProvider);
