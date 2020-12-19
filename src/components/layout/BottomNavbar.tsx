import { Avatar, BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import {
  CloudUploadOutlined,
  HomeOutlined,
  NotificationsOutlined,
  SearchOutlined,
} from '@material-ui/icons';
import { useAuthContext } from 'context';
import { useSearch } from 'hooks';
import { useTranslation } from 'lib';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { ChangeEvent, useState } from 'react';
import { UrlObject } from 'url';
import { mediaUrl, urls } from 'utils';

export const BottomNavbar: React.FC = () => {
  const { t } = useTranslation();
  const { userMe } = useAuthContext();
  const { searchUrl } = useSearch();
  const { pathname, query } = useRouter();
  const userMeId = R.propOr('', 'id', userMe);
  const avatarThumb = R.propOr('', 'avatar', userMe);

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
  const renderProfileLabel = userMe ? t('common:profile') : t('common:login');
  const renderAvatarThumbnail = <Avatar className="avatar-thumbnail" src={mediaUrl(avatarThumb)} />;

  const handleProfileActionClick = (): Promise<boolean> =>
    Router.push(userMeId ? urls.user(userMeId) : urls.login);

  const renderAvatar = userMe ? (
    <Link href={urls.user(userMeId)}>{renderAvatarThumbnail}</Link>
  ) : (
    <Link href={urls.login}>{renderAvatarThumbnail}</Link>
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

  const renderActivityAction = (
    <BottomNavigationAction
      value={4}
      label={t('common:activity')}
      showLabel
      onClick={handleRedirect(urls.activity)}
      icon={<NotificationsOutlined />}
    />
  );

  const renderProfileAction = (
    <BottomNavigationAction
      value={5}
      label={renderProfileLabel}
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
