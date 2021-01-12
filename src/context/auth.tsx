import {
  PaginatedActivityObjectType,
  SchoolObjectType,
  SubjectObjectType,
  UserObjectType,
} from 'generated';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { createContext, useState, useContext } from 'react';

import { AuthContextType } from 'types';
import { mediaUrl, urls } from 'utils';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const AuthContext = createContext<AuthContextType>({});

interface UseAuthContext extends AuthContextType {
  verified: boolean | null;
  unreadActivityCount: number;
  userMeId: string;
  username: string;
  email: string;
  title: string;
  bio: string;
  avatarThumbnail: string;
  avatar: string;
  school: SchoolObjectType | null;
  subject: SubjectObjectType | null;
  loginRequiredTooltip: string | false;
  verificationRequiredTooltip: string | false;
  profileUrl: string;
}

export const useAuthContext = (): UseAuthContext => {
  const { t } = useTranslation();
  const { userMe, setUserMe, ...authContext } = useContext(AuthContext);
  const verified = R.propOr(null, 'verified', userMe);
  const unreadActivityCount = R.propOr(0, 'unreadActivityCount', userMe);
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
  const loginRequiredTooltip: string | false = !userMe && t('common-tooltips:loginRequired');
  const profileUrl = urls.user(userMeId);

  const verificationRequiredTooltip: string | false =
    verified === false && t('common-tooltips:verificationRequired');

  return {
    userMe,
    setUserMe,
    verified,
    unreadActivityCount,
    userMeId,
    username,
    email,
    title,
    bio,
    avatarThumbnail,
    avatar,
    school,
    subject,
    verificationRequiredTooltip,
    loginRequiredTooltip,
    profileUrl,
    ...authContext,
  };
};

export const AuthContextProvider: React.FC = ({ children }) => {
  const [userMe, setUserMe] = useState<UserObjectType | null>(null);
  const [authNetworkError, setAuthNetworkError] = useState(false);
  const [activities, setActivities] = useState<PaginatedActivityObjectType | null>(null);

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
