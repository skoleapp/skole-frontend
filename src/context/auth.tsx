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
  id: string;
  slug: string;
  verified: boolean | null;
  verifiedBackupEmail: boolean;
  unreadActivityCount: number;
  fcmTokens: string[];
  username: string;
  email: string;
  backupEmail: string;
  title: string;
  bio: string;
  avatarThumbnail: string;
  avatar: string;
  rank: string;
  score: number;
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
  const verified: boolean = R.propOr(false, 'verified', userMe);
  const verifiedBackupEmail: boolean = R.propOr(false, 'verifiedBackupEmail', userMe);
  const unreadActivityCount: number = R.propOr(0, 'unreadActivityCount', userMe);
  const id: string = R.propOr('', 'id', userMe);
  const slug: string = R.propOr('', 'slug', userMe);
  const fcmTokens: string[] = R.propOr([], 'fcmTokens', userMe);
  const username: string = R.propOr('', 'username', userMe);
  const email: string = R.propOr('', 'email', userMe);
  const backupEmail: string = R.propOr('', 'backupEmail', userMe);
  const title: string = R.propOr('', 'title', userMe);
  const bio: string = R.propOr('', 'bio', userMe);
  const rank: string = R.propOr('', 'rank', userMe);
  const score: number = R.propOr(0, 'score', userMe);
  const _avatarThumbnail: string = R.propOr('', 'avatarThumbnail', userMe);
  const _avatar: string = R.propOr('', 'avatar', userMe);
  const avatarThumbnail = _avatarThumbnail ? mediaUrl(_avatarThumbnail) : '';
  const avatar = _avatar ? mediaUrl(_avatar) : '';
  const badgeProgresses: BadgeProgressObjectType[] = R.propOr([], 'badgeProgresses', userMe);
  const newBadgeEmailPermission: boolean = R.propOr(false, 'newBadgeEmailPermission', userMe);
  const commentReplyPushPermission: boolean = R.propOr(false, 'commentReplyPushPermission', userMe);
  const newBadgePushPermission: boolean = R.propOr(false, 'newBadgePushPermission', userMe);
  const profileUrl = urls.user(slug);

  const selectedBadgeProgress: BadgeProgressObjectType = R.propOr(
    null,
    'selectedBadgeProgress',
    userMe,
  );

  const commentReplyEmailPermission: boolean = R.propOr(
    false,
    'commentReplyEmailPermission',
    userMe,
  );

  const threadCommentEmailPermission: boolean = R.propOr(
    false,
    'threadCommentEmailPermission',
    userMe,
  );

  const threadCommentPushPermission: boolean = R.propOr(
    false,
    'threadCommentPushPermission',
    userMe,
  );

  return {
    userMe,
    setUserMe,
    id,
    slug,
    verified,
    verifiedBackupEmail,
    unreadActivityCount,
    fcmTokens,
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
