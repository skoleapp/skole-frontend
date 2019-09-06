import withRedux from 'next-redux-wrapper';
import App from 'next/app';
import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { getUser, initStore } from '../redux';

export default withRedux(initStore, { debug: false })(
  class StoreProvider extends App {
    static async getInitialProps({ Component, ctx }) {
      return {
        pageProps: {
          ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})
        }
      };
    }

    render() {
      const { Component, pageProps, store } = this.props;

      return (
        <Provider store={store}>
          <UserProvider {...pageProps} Component={Component} />
        </Provider>
      );
    }
  }
);

// Here we can use redux actions - load user automatically
const UserProvider = ({ pageProps, Component }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    token && dispatch(getUser(token));
    return () => {
      localStorage.clear();
    };
  }, []);

  return <Component {...pageProps} />;
};
