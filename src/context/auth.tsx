import { PaginatedActivityObjectType, UserObjectType } from 'generated';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { createContext, useState, useContext } from 'react';

import { AuthContextType } from 'types';
import { mediaUrl } from 'utils';

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
  const loginRequiredTooltip: string | false = !userMe && t('common-tooltips:loginRequired');

  const verificationRequiredTooltip: string | false =
    verified === false && t('common-tooltips:verificationRequired');

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
  const [activities, setActivities] = useState<PaginatedActivityObjectType | null>(null);

  const userMeId = R.propOr('', 'id', userMe);
  const username = R.propOr('', 'username', userMe);
  const email = R.propOr('', 'email', userMe);
  const title = R.propOr('', 'title', userMe);
  const bio = R.propOr('', 'bio', userMe);
  const _avatarThumbnail = R.propOr('', 'avatarThumbnail', userMe);
  const avatarThumbnail = mediaUrl(_avatarThumbnail);
  const _avatar = R.propOr('', 'avatar', userMe);
  const avatar = mediaUrl(_avatar);
  const school = R.propOr(null, 'school', userMe);
  const subject = R.propOr(null, 'subject', userMe);

  const value = {
    userMe,
    setUserMe,
    userMeId,
    username,
    email,
    title,
    bio,
    avatarThumbnail,
    avatar,
    school,
    subject,
    activities,
    setActivities,
    authNetworkError,
    setAuthNetworkError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
