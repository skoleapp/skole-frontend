import Router from 'next/router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../interfaces';
import { LoadingScreen } from '../layout';

export const PrivatePage: React.FC = ({ children }) => {
  const { authenticated, loading } = useSelector((state: State) => state.auth);

  useEffect(() => {
    !loading && !authenticated && Router.push('/login');
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
