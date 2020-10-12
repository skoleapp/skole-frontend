import { Avatar, BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { CloudUploadOutlined, HomeOutlined, NotificationsOutlined, SearchOutlined } from '@material-ui/icons';
import { useAuthContext } from 'context';
import { useSearch } from 'hooks';
import { Link, useTranslation } from 'lib';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { ChangeEvent, useState } from 'react';
import { UrlObject } from 'url';
import { mediaURL, redirect, urls } from 'utils';

export const BottomNavbar: React.FC = () => {
    const { t } = useTranslation();
    const { userMe } = useAuthContext();
    const userMeId = R.propOr('', 'id', userMe);
    const avatarThumb = R.propOr('', 'avatar', userMe) as string;
    const { pathname, query } = useRouter();
    const { searchUrl } = useSearch();

    const getNavbarValue = (): number | null => {
        switch (pathname) {
            case urls.home: {
                return 1;
            }
            case searchUrl.pathname: {
                return 2;
            }
            case urls.uploadResource: {
                return 3;
            }
            case urls.activity: {
                return 4;
            }
            case urls.user: {
                if (!!userMe && query.id === userMe.id) {
                    return 5;
                }
            }
            default: {
                return null;
            }
        }
    };

    const [value, setValue] = useState(getNavbarValue());
    const handleChange = (_e: ChangeEvent<{}>, newValue: number): void => setValue(newValue);
    const handleRedirect = (url: string | UrlObject) => (): Promise<boolean> => redirect(url);

    const renderProfileLabel = !!userMe ? t('common:profile') : t('common:login');
    const renderAvatarThumbnail = <Avatar className="avatar-thumbnail" src={mediaURL(avatarThumb)} />;

    const renderAvatar = !!userMe ? (
        <Link href={urls.user} as={`/users/${userMeId}`}>
            {renderAvatarThumbnail}
        </Link>
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

    const renderUploadResourceAction = (
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
        <BottomNavigationAction value={5} label={renderProfileLabel} showLabel icon={renderAvatar} />
    );

    return (
        <BottomNavigation value={value} onChange={handleChange}>
            {renderHomeAction}
            {renderSearchAction}
            {renderUploadResourceAction}
            {renderActivityAction}
            {renderProfileAction}
        </BottomNavigation>
    );
};
