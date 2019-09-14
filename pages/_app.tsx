import { NextPage, NextPageContext } from 'next';
import withRedux from 'next-redux-wrapper';
import { AppContextType } from 'next-server/dist/lib/utils';
import { AppContext } from 'next/app';
import { Router } from 'next/router';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from 'redux';
import { getUser, initStore } from '../redux';
import '../styles';

interface StatelessPage<P = {}> extends React.FC<P> {
  getInitialProps?: ({ Component, ctx }: AppContextType<Router>) => Promise<{ pageProps: {} }>;
}
interface Props {
  store: Store;
  Component: NextPage<any>; // eslint-disable-line
  pageProps: NextPageContext;
}

const AppProvider: StatelessPage<Props> = ({ store, Component, pageProps }: Props) => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    token && store.dispatch(getUser(token));
  });

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
