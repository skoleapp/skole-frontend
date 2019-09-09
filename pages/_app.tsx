import withRedux from 'next-redux-wrapper';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';
import { getUser, initStore } from '../redux';

const AppProvider = ({ store, Component, pageProps }) => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    token && store.dispatch(getUser(token));
  });

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

AppProvider.getInitialProps = async ({ Component, ctx }) => {
  return {
    pageProps: {
      ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})
    }
  };
};

export default withRedux(initStore, { debug: false })(AppProvider);
