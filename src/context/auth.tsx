import {
  BadgeProgressObjectType,
  PaginatedActivityObjectType,
  UserFieldsFragment,
} from 'generated';
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
  backupEmail: string;
  title: string;
  bio: string;
  avatarThumbnail: string;
  avatar: string;
  rank: string;
  score: string;
  badgeProgresses: BadgeProgressObjectType[];
  selectedBadgeProgress: BadgeProgressObjectType | null;
  commentReplyEmailPermission: boolean;
  threadCommentEmailPermission: boolean;
  newBadgeEmailPermission: boolean;
  commentReplyPushPermission: boolean;
  threadCommentPushPermission: boolean;
  newBadgePushPermission: boolean;
  profileUrl: string;
}

export const useAuthContext = (): UseAuthContext => {
  const { userMe, setUserMe, ...authContext } = useContext(AuthContext);
  const verified = R.prop('verified', userMe);
  const unreadActivityCount = R.prop('unreadActivityCount', userMe);
  const slug = R.prop('slug', userMe);
  const fcmToken = R.prop('fcmToken', userMe);
  const username = R.prop('username', userMe);
  const email = R.prop('email', userMe);
  const backupEmail = R.prop('backupEmail', userMe);
  const title = R.prop('title', userMe);
  const bio = R.prop('bio', userMe);
  const rank = R.prop('rank', userMe);
  const score = R.prop('score', userMe);
  const avatarThumbnail = mediaUrl(R.prop('avatarThumbnail', userMe));
  const avatar = mediaUrl(R.prop('avatar', userMe));
  const badgeProgresses = R.propOr([], 'badgeProgresses', userMe);
  const selectedBadgeProgress = R.prop('selectedBadgeProgress', userMe);
  const commentReplyEmailPermission = R.prop('commentReplyEmailPermission', userMe);
  const threadCommentEmailPermission = R.prop('threadCommentEmailPermission', userMe);
  const newBadgeEmailPermission = R.prop('newBadgeEmailPermission', userMe);
  const commentReplyPushPermission = R.prop('commentReplyPushPermission', userMe);
  const threadCommentPushPermission = R.prop('threadCommentPushPermission', userMe);
  const newBadgePushPermission = R.prop('newBadgePushPermission', userMe);
  const profileUrl = urls.user(slug);

  return {
    userMe,
    setUserMe,
    verified,
    unreadActivityCount,
    fcmToken,
    username,
    email,
    backupEmail,
    title,
    bio,
    rank,
    score,
    avatarThumbnail,
    avatar,
    badgeProgresses,
    selectedBadgeProgress,
    commentReplyEmailPermission,
    threadCommentEmailPermission,
    newBadgeEmailPermission,
    commentReplyPushPermission,
    threadCommentPushPermission,
    newBadgePushPermission,
    profileUrl,
    ...authContext,
  };
};

export const AuthContextProvider: React.FC = ({ children }) => {
  const [userMe, setUserMe] = useState<UserFieldsFragment | null>(null);
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
