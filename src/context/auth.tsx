import {
  BadgeProgressObjectType,
  PaginatedActivityObjectType,
  SchoolObjectType,
  SubjectObjectType,
  UserMeFieldsFragment,
} from 'generated';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { createContext, useContext, useState } from 'react';
import { AuthContextType } from 'types';
import { mediaUrl, urls } from 'utils';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const AuthContext = createContext<AuthContextType>({});

interface UseAuthContext extends AuthContextType {
  verified: boolean | null;
  unreadActivityCount: number;
  fcmToken: string;
  username: string;
  email: string;
  title: string;
  bio: string;
  avatarThumbnail: string;
  avatar: string;
  rank: string;
  score: string;
  school: SchoolObjectType | null;
  subject: SubjectObjectType | null;
  badgeProgresses: BadgeProgressObjectType[];
  selectedBadgeProgress: BadgeProgressObjectType | null;
  productUpdateEmailPermission: boolean;
  blogPostEmailPermission: boolean;
  commentReplyEmailPermission: boolean;
  courseCommentEmailPermission: boolean;
  resourceCommentEmailPermission: boolean;
  commentReplyPushPermission: boolean;
  courseCommentPushPermission: boolean;
  resourceCommentPushPermission: boolean;
  loginRequiredTooltip: string | false;
  verificationRequiredTooltip: string | false;
  profileUrl: string;
}

export const useAuthContext = (): UseAuthContext => {
  const { t } = useTranslation();
  const { userMe, setUserMe, ...authContext } = useContext(AuthContext);
  const verified = R.prop('verified', userMe);
  const unreadActivityCount = R.prop('unreadActivityCount', userMe);
  const slug = R.prop('slug', userMe);
  const fcmToken = R.prop('fcmToken', userMe);
  const username = R.prop('username', userMe);
  const email = R.prop('email', userMe);
  const title = R.prop('title', userMe);
  const bio = R.prop('bio', userMe);
  const rank = R.prop('rank', userMe);
  const score = R.prop('score', userMe);
  const avatarThumbnail = mediaUrl(R.prop('avatarThumbnail', userMe));
  const avatar = mediaUrl(R.prop('avatar', userMe));
  const school = R.prop('school', userMe);
  const subject = R.prop('subject', userMe);
  const badgeProgresses = R.propOr([], 'badgeProgresses', userMe);
  const selectedBadgeProgress = R.prop('selectedBadgeProgress', userMe);
  const productUpdateEmailPermission = R.prop('productUpdateEmailPermission', userMe);
  const blogPostEmailPermission = R.prop('blogPostEmailPermission', userMe);
  const commentReplyEmailPermission = R.prop('commentReplyEmailPermission', userMe);
  const courseCommentEmailPermission = R.prop('courseCommentEmailPermission', userMe);
  const resourceCommentEmailPermission = R.prop('resourceCommentEmailPermission', userMe);
  const commentReplyPushPermission = R.prop('commentReplyPushPermission', userMe);
  const courseCommentPushPermission = R.prop('courseCommentPushPermission', userMe);
  const resourceCommentPushPermission = R.prop('resourceCommentPushPermission', userMe);
  const loginRequiredTooltip: string | false = !userMe && t('common-tooltips:loginRequired');
  const profileUrl = urls.user(slug);

  const verificationRequiredTooltip: string | false =
    verified === false && t('common-tooltips:verificationRequired');

  return {
    userMe,
    setUserMe,
    verified,
    unreadActivityCount,
    fcmToken,
    username,
    email,
    title,
    bio,
    rank,
    score,
    avatarThumbnail,
    avatar,
    school,
    subject,
    badgeProgresses,
    selectedBadgeProgress,
    productUpdateEmailPermission,
    blogPostEmailPermission,
    commentReplyEmailPermission,
    courseCommentEmailPermission,
    resourceCommentEmailPermission,
    commentReplyPushPermission,
    courseCommentPushPermission,
    resourceCommentPushPermission,
    verificationRequiredTooltip,
    loginRequiredTooltip,
    profileUrl,
    ...authContext,
  };
};

export const AuthContextProvider: React.FC = ({ children }) => {
  const [userMe, setUserMe] = useState<UserMeFieldsFragment | null>(null);
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
