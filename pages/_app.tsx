import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { NextPage, NextPageContext } from 'next';
import withRedux from 'next-redux-wrapper';
import App from 'next/app';
import { AppContextType } from 'next/dist/next-server/lib/utils';
import Router, { Router as RouterType } from 'next/router';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { Store } from 'redux';
import { LoadingScreen } from '../components/layout';
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

  state = {
    redirect: false
  };

  componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side');

    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, store, pageProps } = this.props;

    Router.events.on('routeChangeStart', () => this.setState({ ...this.state, redirect: true }));
    Router.events.on('routeChangeError', () => this.setState({ ...this.state, redirect: false }));
    Router.events.on('routeChangeComplete', () =>
      this.setState({ ...this.state, redirect: false })
    );

    if (this.state.redirect) {
      return <LoadingScreen />;
    }

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
