import { NextPage, NextPageContext } from 'next';
import withRedux from 'next-redux-wrapper';
import App from 'next/app';
import { AppContextType } from 'next/dist/next-server/lib/utils';
import Router, { Router as RouterType } from 'next/router';
import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { LoadingScreen } from '../components/layout';
import { initStore } from '../redux';
import '../styles';
interface Props {
  Component: NextPage<any>; // eslint-disable-line
  pageProps: NextPageContext;
  store: Store;
}

class SkoleApp extends App<Props> {
  static async getInitialProps ({ Component, ctx }: AppContextType<RouterType>) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  state = {
    redirect: false
  }

  render() {
    const {Component, store, pageProps} = this.props

    Router.events.on('routeChangeStart', () => this.setState({ ...this.state, redirect: true }));
    Router.events.on('routeChangeComplete', () => this.setState({ ...this.state, redirect: false }));
    Router.events.on('routeChangeError', () => this.setState({ ...this.state, redirect: false }));
  
    if (this.state.redirect) {
      return <LoadingScreen />;
    }
  
    return (
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
    );
  }
};

export default withRedux(initStore)(SkoleApp);
