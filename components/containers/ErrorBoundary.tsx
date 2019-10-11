import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../interfaces';
import { ErrorPage } from '../organisms';

export const ErrorBoundary: React.FC = ({ children }) => {
  const authError = useSelector((state: State) => state.auth.errors);

  if (authError && authError.serverNotFound) {
    return <ErrorPage error={authError.serverNotFound} />;
  }

  return <>{children}</>;
};
