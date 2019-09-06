import withRedux from 'next-redux-wrapper';
import App from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import { initStore } from '../redux';

class AppProvider extends App {
  render() {
    const { Component, pageProps, store } = this.props;

    return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}

AppProvider.getInitialProps = async ({ Component, ctx }) => {
  return {
    pageProps: {
      ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})
    }
  };
};

export default withRedux(initStore, { debug: false })(AppProvider);
