import Router from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../interfaces';
import { LoadingScreen } from '../layout';

export const PrivatePage: React.FC = ({ children }) => {
  const { authenticated, loading } = useSelector((state: State) => state.auth);

  if (loading) {
    return <LoadingScreen text="Loading user details..." />;
  }

  if (!authenticated) {
    return Router.push('/login') && <LoadingScreen text="Redirecting to login screen..." />;
  }

  return <>{children}</>;
};
