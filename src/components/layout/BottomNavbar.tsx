import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import AddOutlined from '@material-ui/icons/AddOutlined';
import HomeOutlined from '@material-ui/icons/HomeOutlined';
import NotificationsOutlined from '@material-ui/icons/NotificationsOutlined';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import { useAuthContext, useThreadFormContext } from 'context';
import { useTranslation } from 'lib';
import Router, { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { urls } from 'utils';

export const BottomNavbar: React.FC = () => {
  const { t } = useTranslation();
  const { pathname, query } = useRouter();
  const { avatarThumbnail, unreadActivityCount, profileUrl, slug } = useAuthContext();
  const { handleOpenThreadForm } = useThreadFormContext();

  const handleRedirect = (url: string) => async (): Promise<boolean> => Router.push(url);

  const getNavbarValue = (): void | number | null => {
    switch (pathname) {
      case urls.home: {
        return 1;
      }

      case urls.search: {
        return 2;
      }

      case urls.activity: {
        return 4;
      }

      case '/users/[slug]': {
        if (slug === query.slug) {
          return 5;
        }

        break;
      }

      default: {
        return null;
      }
    }
  };

  const renderAvatar = useMemo(
    () => <Avatar className="avatar-thumbnail" src={avatarThumbnail} />,
    [avatarThumbnail],
  );

  const renderHomeAction = useMemo(
    () => (
      <BottomNavigationAction
        value={1}
        onClick={handleRedirect(urls.home)}
        label={t('common:home')}
        showLabel
        icon={<HomeOutlined />}
      />
    ),
    [t],
  );

  const renderSearchAction = useMemo(
    () => (
      <BottomNavigationAction
        value={2}
        onClick={handleRedirect(urls.search)}
        label={t('common:search')}
        showLabel
        icon={<SearchOutlined />}
      />
    ),
    [t],
  );

  const renderCreateThreadAction = useMemo(
    () => (
      <BottomNavigationAction
        value={3}
        label={t('common:create')}
        showLabel
        onClick={(): void => handleOpenThreadForm()}
        icon={<AddOutlined />}
      />
    ),
    [t, handleOpenThreadForm],
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
        onClick={handleRedirect(urls.activity)}
        label={t('common:activity')}
        showLabel
        icon={renderActivityIcon}
      />
    ),
    [renderActivityIcon, t],
  );

  const renderProfileAction = useMemo(
    () => (
      <BottomNavigationAction
        value={5}
        onClick={handleRedirect(profileUrl)}
        label={t('common:profile')}
        showLabel
        icon={renderAvatar}
      />
    ),
    [renderAvatar, profileUrl, t],
  );

  return (
    <BottomNavigation value={getNavbarValue()}>
      {renderHomeAction}
      {renderSearchAction}
      {renderCreateThreadAction}
      {renderActivityAction}
      {renderProfileAction}
    </BottomNavigation>
  );
};
