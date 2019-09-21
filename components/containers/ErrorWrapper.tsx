import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../interfaces';
import { ErrorPage } from '../organisms';

export const ErrorWrapper: React.FC = ({ children }) => {
  const authError = useSelector((state: State) => state.auth.errors);
  const searchError = useSelector((state: State) => state.search.errors);

  if (authError && authError.serverError) {
    return <ErrorPage error={authError.serverError} />;
  }

  if (searchError && searchError.serverError) {
    return <ErrorPage error={searchError.serverError} />;
  }

  return <>{children}</>;
};
