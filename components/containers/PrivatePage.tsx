import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../interfaces';
import { LoadingScreen } from '../layout';
import { Redirect } from '../utils';

export const PrivatePage: React.FC = ({ children }) => {
  const { authenticated, loading } = useSelector((state: State) => state.auth);

  if (loading) {
    return <LoadingScreen loadingText="Loading user details..." />;
  }

  if (!authenticated) {
    return <Redirect to="login" loadingText="Loading login screen..." />;
  }

  return <>{children}</>;
};
