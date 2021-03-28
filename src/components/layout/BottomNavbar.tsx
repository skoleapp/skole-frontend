import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeOutlined from '@material-ui/icons/HomeOutlined';
import NotificationsOutlined from '@material-ui/icons/NotificationsOutlined';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import StarOutlineOutlined from '@material-ui/icons/StarOutlineOutlined';
import { useAuthContext } from 'context';
import { useTranslation } from 'lib';
import Router, { useRouter } from 'next/router';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { UrlObject } from 'url';
import { urls } from 'utils';

import { Link } from '../shared';

export const BottomNavbar: React.FC = () => {
  const { t } = useTranslation();
  const { userMe, avatarThumbnail, unreadActivityCount, profileUrl } = useAuthContext();
  const { pathname, query } = useRouter();

  const getNavbarValue = (): void | number | null => {
    switch (pathname) {
      case urls.home: {
        return 1;
      }

      case urls.search: {
        return 2;
      }

      case urls.starred: {
        return 3;
      }

      case urls.activity: {
        return 4;
      }

      case '/users/[id]': {
        if (!!userMe && query.id === userMe.id) {
          return 5;
        }

        break;
      }

      default: {
        return null;
      }
    }
  };

  const [value, setValue] = useState(getNavbarValue());

  const handleChange = (_e: ChangeEvent<Record<symbol, unknown>>, newValue: number): void =>
    setValue(newValue);

  const handleRedirect = (url: string | UrlObject) => (): Promise<boolean> => Router.push(url);
  const profileLabel = userMe ? t('common:profile') : t('common:login');
  const authUrl = userMe ? profileUrl : urls.login;

  const handleProfileActionClick = useCallback((): Promise<boolean> => Router.push(authUrl), [
    authUrl,
  ]);

  const renderAvatar = useMemo(
    () => (
      <Link href={authUrl}>
        <Avatar className="avatar-thumbnail" src={avatarThumbnail} />
      </Link>
    ),
    [authUrl, avatarThumbnail],
  );

  const renderHomeAction = useMemo(
    () => (
      <BottomNavigationAction
        value={1}
        label={t('common:home')}
        showLabel
        onClick={handleRedirect(urls.home)}
        icon={<HomeOutlined />}
      />
    ),
    [t],
  );

  const renderSearchAction = useMemo(
    () => (
      <BottomNavigationAction
        value={2}
        label={t('common:search')}
        showLabel
        onClick={handleRedirect(urls.search)}
        icon={<SearchOutlined />}
      />
    ),
    [t],
  );

  const renderStarredAction = useMemo(
    () => (
      <BottomNavigationAction
        value={3}
        label={t('common:starred')}
        showLabel
        onClick={handleRedirect(urls.starred)}
        icon={<StarOutlineOutlined />}
      />
    ),
    [t],
  );

  const renderActivityIcon = useMemo(
    () => (
      <Badge badgeContent={unreadActivityCount} variant="dot">
        <NotificationsOutlined />
      </Badge>
    ),
    [unreadActivityCount],
  );

  const renderActivityAction = useMemo(
    () => (
      <BottomNavigationAction
        value={4}
        label={t('common:activity')}
        showLabel
        onClick={handleRedirect(urls.activity)}
        icon={renderActivityIcon}
      />
    ),
    [renderActivityIcon, t],
  );

  const renderProfileAction = useMemo(
    () => (
      <BottomNavigationAction
        value={5}
        label={profileLabel}
        showLabel
        onClick={handleProfileActionClick}
        icon={renderAvatar}
      />
    ),
    [handleProfileActionClick, profileLabel, renderAvatar],
  );

  return (
    <BottomNavigation value={value} onChange={handleChange}>
      {renderHomeAction}
      {renderSearchAction}
      {renderStarredAction}
      {renderActivityAction}
      {renderProfileAction}
    </BottomNavigation>
  );
};
