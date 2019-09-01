import React from 'react';
import { Provider } from 'react-redux';
import App, { Container } from 'next/app';
import withRedux from 'next-redux-wrapper';
import initStore from '../redux';

declare interface PropsParams {
  Component: any;
  ctx: any;
}

export default withRedux(initStore, { debug: true })(
  class MyApp extends App {
    static async getInitialProps({ Component, ctx }: PropsParams) {
      return {
        pageProps: {
          ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})
        }
      };
    }

    render() {
      const { Component, pageProps, store }: any = this.props;
      return (
        <Container>
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </Container>
      );
    }
  }
);
