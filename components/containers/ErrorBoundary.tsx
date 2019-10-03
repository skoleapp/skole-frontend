import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../interfaces';
import { ErrorPage } from '../organisms';

export const ErrorBoundary: React.FC = ({ children }) => {
  const authError = useSelector((state: State) => state.auth.errors);
  const searchError = useSelector((state: State) => state.search.errors);

  if (authError && authError.serverNotFound) {
    return <ErrorPage error={authError.serverNotFound} />;
  }

  if (searchError && searchError.serverNotFound) {
    return <ErrorPage error={searchError.serverNotFound} />;
  }

  return <>{children}</>;
};
