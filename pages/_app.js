import withRedux from 'next-redux-wrapper';
import App from 'next/app';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { initStore } from '../redux';

const AppWrapper = ({ Component, pageProps, store }) => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);
    console.log('test');
    return () => {};
  }, []);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

class ConnectedApp extends App {
  render() {
    return <AppWrapper {...this.props} />;
  }
}

ConnectedApp.getInitialProps = async ({ Component, ctx }) => {
  return {
    pageProps: {
      ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})
    }
  };
};

export default withRedux(initStore, { debug: false })(ConnectedApp);
