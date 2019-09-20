import Router from 'next/router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../interfaces';
import { LoadingScreen } from '../layout';

// FIXME: Find a proper typing for the props
// eslint-disable-next-line
export const PrivatePage: React.FC<any> = ({ component: Component, ...props }) => {
  const { authenticated, loading } = useSelector((state: State) => state.auth);

  // Wait until authenticated state is set to either true or false
  useEffect(() => {
    if (authenticated === false) {
      Router.push('/login');
    }
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return <Component {...props} />;
};
