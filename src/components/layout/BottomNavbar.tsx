import { Avatar, BottomNavigationAction } from '@material-ui/core';
import { CloudUploadOutlined, HomeOutlined, NotificationsOutlined, SearchOutlined } from '@material-ui/icons';
import { useAuthContext } from 'context';
import { useSearch } from 'hooks';
import { Link } from 'i18n';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { ChangeEvent, useState } from 'react';
import { UrlObject } from 'url';
import { mediaURL, redirect, urls } from 'utils';

import { StyledBottomNavigation } from '..';

export const BottomNavbar: React.FC = () => {
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

    const handleChange = (_e: ChangeEvent<HTMLButtonElement>, newValue: number): void => {
        setValue(newValue);
    };

    const handleRedirect = (url: string | UrlObject) => (): void => redirect(url);

    const renderAvatar = (
        <Link href={urls.user} as={`/users/${userMeId}`}>
            <Avatar className="avatar-thumbnail" src={mediaURL(avatarThumb)} />
        </Link>
    );

    const renderHomeAction = (
        <BottomNavigationAction value={1} onClick={handleRedirect(urls.home)} icon={<HomeOutlined />} />
    );

    const renderSearchAction = (
        <BottomNavigationAction value={2} onClick={handleRedirect(searchUrl)} icon={<SearchOutlined />} />
    );

    const renderUploadResourceAction = (
        <BottomNavigationAction
            value={3}
            onClick={handleRedirect(urls.uploadResource)}
            icon={<CloudUploadOutlined />}
        />
    );

    const renderActivityAction = (
        <BottomNavigationAction value={4} onClick={handleRedirect(urls.activity)} icon={<NotificationsOutlined />} />
    );

    const renderProfileAction = <BottomNavigationAction value={5} icon={renderAvatar} />;

    return (
        <StyledBottomNavigation value={value} onChange={handleChange}>
            {renderHomeAction}
            {renderSearchAction}
            {renderUploadResourceAction}
            {renderActivityAction}
            {renderProfileAction}
        </StyledBottomNavigation>
    );
};
