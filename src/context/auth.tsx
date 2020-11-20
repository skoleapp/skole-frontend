import { PaginatedActivityObjectType, UserObjectType } from 'generated';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { createContext, useState } from 'react';
import { useContext } from 'react';
import { AuthContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const AuthContext = createContext<AuthContextType>({});

interface UseAuthContext extends AuthContextType {
  verified: boolean | null;
  loginRequiredTooltip: string | false;
  verificationRequiredTooltip: string | false;
}

export const useAuthContext = (): UseAuthContext => {
  const { t } = useTranslation();
  const { userMe, setUserMe, ...authContext } = useContext(AuthContext);
  const verified: boolean = R.propOr(null, 'verified', userMe);

  const loginRequiredTooltip: string | false =
    !userMe && t('tooltips:loginRequired');

  const verificationRequiredTooltip: string | false =
    verified === false && t('tooltips:verificationRequired');

  return {
    userMe,
    setUserMe,
    verified,
    verificationRequiredTooltip,
    loginRequiredTooltip,
    ...authContext,
  };
};

export const AuthContextProvider: React.FC = ({ children }) => {
  const [userMe, setUserMe] = useState<UserObjectType | null>(null);
  const [authNetworkError, setAuthNetworkError] = useState(false);

  const [
    activities,
    setActivities,
  ] = useState<PaginatedActivityObjectType | null>(null);

  const value = {
    userMe,
    setUserMe,
    activities,
    setActivities,
    authNetworkError,
    setAuthNetworkError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
