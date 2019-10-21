import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { NextPage, NextPageContext } from 'next';
import withRedux from 'next-redux-wrapper';
import App from 'next/app';
import { AppContextType } from 'next/dist/next-server/lib/utils';
import Router, { Router as RouterType } from 'next/router';
import NProgress from 'nprogress';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { Store } from 'redux';
import { initStore, withApollo } from '../lib';
import '../public';
import { theme } from '../public';

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

  componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side');

    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, store, pageProps } = this.props;

    Router.events.on('routeChangeStart', () => NProgress.start());
    Router.events.on('routeChangeError', () => NProgress.done());
    Router.events.on('routeChangeComplete', () => NProgress.done());

    return (
      <StoreProvider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </StoreProvider>
    );
  }
}

export default withApollo(withRedux(initStore)(SkoleApp));
