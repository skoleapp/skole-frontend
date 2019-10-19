import { NextPage, NextPageContext } from 'next';
import withRedux from 'next-redux-wrapper';
import App from 'next/app';
import { AppContextType } from 'next/dist/next-server/lib/utils';
import Router, { Router as RouterType } from 'next/router';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { Store } from 'redux';
import { PersistGate } from 'redux-persist/integration/react';
import { LoadingScreen } from '../components/layout';
import { initStore } from '../lib';
import '../styles';

interface Props {
  Component: NextPage<any>;
  pageProps: NextPageContext;
  store: Store;
}

class SkoleApp extends App<Props> {
  static async getInitialProps({ Component, ctx }: AppContextType<RouterType>) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  state = {
    redirect: false
  };

  render() {
    const { Component, store, pageProps } = this.props;

    Router.events.on('routeChangeStart', () => this.setState({ ...this.state, redirect: true }));

    Router.events.on('routeChangeComplete', () =>
      this.setState({ ...this.state, redirect: false })
    );

    Router.events.on('routeChangeError', () => this.setState({ ...this.state, redirect: false }));

    if (this.state.redirect) {
      return <LoadingScreen />;
    }

    return (
      <StoreProvider store={store}>
        <PersistGate persistor={(store as any).__PERSISTOR} loading={null}>
          <Component {...pageProps} />
        </PersistGate>
      </StoreProvider>
    );
  }
}

export default withRedux(initStore)(SkoleApp);
