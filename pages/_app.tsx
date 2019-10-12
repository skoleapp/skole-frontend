import { ClientContext, GraphQLClient } from 'graphql-hooks';
import { NextPage, NextPageContext } from 'next';
import { AppContextType } from 'next/dist/next-server/lib/utils';
import Router, { Router as RouterType } from 'next/router';
import React, { useState } from 'react';
import { LoadingScreen } from '../components/layout';
import withGraphQLClient from '../lib/with-graphql-client';
import '../styles';

interface StatelessPage<P = {}> extends React.FC<P> {
  getInitialProps?: ({ Component, ctx }: AppContextType<RouterType>) => Promise<{ pageProps: {} }>;
}
interface Props {
  Component: NextPage<any>; // eslint-disable-line
  pageProps: NextPageContext;
  graphQLClient: GraphQLClient;
}

const App: StatelessPage<Props> = ({ Component, pageProps, graphQLClient }) => {
  const [redirect, setRedirect] = useState(false);

  Router.events.on('routeChangeStart', () => setRedirect(true));
  Router.events.on('routeChangeComplete', () => setRedirect(false));
  Router.events.on('routeChangeError', () => setRedirect(false));

  if (redirect) {
    return <LoadingScreen />;
  }

  return (
    <ClientContext.Provider value={graphQLClient}>
      <Component {...pageProps} />
    </ClientContext.Provider>
  );
};

export default withGraphQLClient(App);
