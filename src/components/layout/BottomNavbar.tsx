import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import CloudUploadOutlined from '@material-ui/icons/CloudUploadOutlined';
import HomeOutlined from '@material-ui/icons/HomeOutlined';
import NotificationsOutlined from '@material-ui/icons/NotificationsOutlined';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import { useAuthContext } from 'context';
import { useSearch } from 'hooks';
import { useTranslation } from 'lib';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import React, { ChangeEvent, useState } from 'react';
import { UrlObject } from 'url';
import { urls } from 'utils';

export const BottomNavbar: React.FC = () => {
  const { t } = useTranslation();
  const { userMe, avatarThumbnail, unreadActivityCount, profileUrl } = useAuthContext();
  const { searchUrl } = useSearch();
  const { pathname, query } = useRouter();

  const getNavbarValue = (): void | number | null => {
    switch (pathname) {
      case urls.home: {
        return 1;
      }
      case urls.search: {
        return 2;
      }
      case urls.uploadResource: {
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
  const handleProfileActionClick = (): Promise<boolean> => Router.push(authUrl);

  const renderAvatar = (
    <Link href={authUrl}>
      <Avatar className="avatar-thumbnail" src={avatarThumbnail} />
    </Link>
  );

  const renderHomeAction = (
    <BottomNavigationAction
      value={1}
      label={t('common:home')}
      showLabel
      onClick={handleRedirect(urls.home)}
      icon={<HomeOutlined />}
    />
  );

  const renderSearchAction = (
    <BottomNavigationAction
      value={2}
      label={t('common:search')}
      showLabel
      onClick={handleRedirect(searchUrl)}
      icon={<SearchOutlined />}
    />
  );

  const renderUploadAction = (
    <BottomNavigationAction
      value={3}
      label={t('common:upload')}
      showLabel
      onClick={handleRedirect(urls.uploadResource)}
      icon={<CloudUploadOutlined />}
    />
  );

  const renderActivityIcon = (
    <Badge badgeContent={unreadActivityCount} color="primary" variant="dot">
      <NotificationsOutlined />
    </Badge>
  );

  const renderActivityAction = (
    <BottomNavigationAction
      value={4}
      label={t('common:activity')}
      showLabel
      onClick={handleRedirect(urls.activity)}
      icon={renderActivityIcon}
    />
  );

  const renderProfileAction = (
    <BottomNavigationAction
      value={5}
      label={profileLabel}
      showLabel
      onClick={handleProfileActionClick}
      icon={renderAvatar}
    />
  );

  return (
    <BottomNavigation value={value} onChange={handleChange}>
      {renderHomeAction}
      {renderSearchAction}
      {renderUploadAction}
      {renderActivityAction}
      {renderProfileAction}
    </BottomNavigation>
  );
};
