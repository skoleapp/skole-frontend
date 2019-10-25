import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import ApolloClient from 'apollo-client';
import { NextPage, NextPageContext } from 'next';
import withRedux from 'next-redux-wrapper';
import App from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { Store } from 'redux';
import { getUserMe, setUserMe } from '../actions';
import { User } from '../interfaces';
import { initStore } from '../lib';
import { getToken } from '../lib/getToken';
import { GlobalStyle, theme } from '../styles';

interface Props {
  Component: NextPage<any>; // eslint-disable-line
  pageProps: NextPageContext;
  store: Store;
  apolloClient: ApolloClient<any>; // eslint-disable-line
  userMe?: User;
  reduxStore: Store;
}

class SkoleApp extends App<Props> {
  componentDidMount(): void {
    const jssStyles = document.querySelector('#jss-server-side');

    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    const { store, userMe } = this.props;

    if (userMe) {
      store.dispatch(setUserMe(userMe));
    }
  }

  render(): JSX.Element {
    const { Component, pageProps, store } = this.props;

    Router.events.on('routeChangeStart', () => NProgress.start());
    Router.events.on('routeChangeComplete', () => NProgress.done());
    Router.events.on('routeChangeError', () => NProgress.done());

    return (
      <StoreProvider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyle />
          <Component {...pageProps} />
        </ThemeProvider>
      </StoreProvider>
    );
  }
}

// eslint-disable-next-line
SkoleApp.getInitialProps = async ({ Component, ctx }: any): Promise<any> => {
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  const { req, apolloClient } = ctx;
  const token = getToken(req);

  if (token) {
    const { userMe } = await getUserMe(apolloClient);
    return { userMe, pageProps };
  }

  return { pageProps };
};

export default withRedux(initStore)(SkoleApp);
