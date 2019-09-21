import { NextPage, NextPageContext } from 'next';
import withRedux from 'next-redux-wrapper';
import { AppContext } from 'next/app';
import { AppContextType } from 'next/dist/next-server/lib/utils';
import Router, { Router as RouterType } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { LoadingScreen } from '../components/layout';
import { initStore, refreshToken, setToken } from '../redux';
import '../styles';

interface StatelessPage<P = {}> extends React.FC<P> {
  getInitialProps?: ({ Component, ctx }: AppContextType<RouterType>) => Promise<{ pageProps: {} }>;
}
interface Props {
  store: Store;
  Component: NextPage<any>; // eslint-disable-line
  pageProps: NextPageContext;
}

const AppProvider: StatelessPage<Props> = ({ store, Component, pageProps }: Props) => {
  const [redirect, setRedirect] = useState(false);

  // FIXME: these are causing memory leaks
  Router.events.on('routeChangeStart', () => setRedirect(true));
  Router.events.on('routeChangeComplete', () => setRedirect(false));
  Router.events.on('routeChangeError', () => setRedirect(false));

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem('token');
    token && store.dispatch(setToken(token));
    store.dispatch(refreshToken(token));
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
