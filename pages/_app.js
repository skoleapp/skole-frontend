import withRedux from 'next-redux-wrapper';
import App from 'next/app';
import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';
import { getUser, initStore } from '../redux';

// Here we can use redux actions - load user automatically
const UserProvider = ({ pageProps, Component }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    token && dispatch(getUser(token));
  }, []);

  return <Component {...pageProps} />;
};

class StoreProvider extends App {
  render() {
    const { Component, pageProps, store } = this.props;

    return (
      <Provider store={store}>
        <UserProvider {...pageProps} Component={Component} />
      </Provider>
    );
  }
}

StoreProvider.getInitialProps = async ({ Component, ctx }) => {
  return {
    pageProps: {
      ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})
    }
  };
};

export default withRedux(initStore, { debug: false })(StoreProvider);
