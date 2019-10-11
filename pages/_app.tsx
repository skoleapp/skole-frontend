import { ClientContext, GraphQLClient } from 'graphql-hooks';
import { NextPage, NextPageContext } from 'next';
import withRedux from 'next-redux-wrapper';
import { AppContextType } from 'next/dist/next-server/lib/utils';
import Router, { Router as RouterType } from 'next/router';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { LoadingScreen } from '../components/layout';
import withGraphQLClient from '../lib/with-graphql-client';
import { initStore } from '../redux';
import '../styles';

interface StatelessPage<P = {}> extends React.FC<P> {
  getInitialProps?: ({ Component, ctx }: AppContextType<RouterType>) => Promise<{ pageProps: {} }>;
}
interface Props {
  Component: NextPage<any>; // eslint-disable-line
  pageProps: NextPageContext;
  graphQLClient: GraphQLClient;
  store: Store;
}

const App: StatelessPage<Props> = ({ Component, pageProps, graphQLClient, store }) => {
  const [redirect, setRedirect] = useState(false);

  Router.events.on('routeChangeStart', () => setRedirect(true));
  Router.events.on('routeChangeComplete', () => setRedirect(false));
  Router.events.on('routeChangeError', () => setRedirect(false));

  if (redirect) {
    return <LoadingScreen />;
  }

  return (
    <ClientContext.Provider value={graphQLClient}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ClientContext.Provider>
  );
};

export default withGraphQLClient(withRedux(initStore, { debug: false })(App));
