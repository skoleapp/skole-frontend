import { Avatar, BottomNavigationAction } from '@material-ui/core';
import { CloudUploadOutlined, HomeOutlined, NotificationsOutlined, SearchOutlined } from '@material-ui/icons';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { ChangeEvent, useState } from 'react';
import { useAuthContext } from 'src/context';
import { UrlObject } from 'url';

import { Link, Router } from '../../i18n';
import { mediaURL, useSearch } from '../../utils';
import { StyledBottomNavigation } from '../shared';

export const BottomNavbar: React.FC = () => {
    const { user } = useAuthContext();
    const avatarThumb = R.propOr('', 'avatar', user) as string;
    const { pathname, query } = useRouter();
    const home = '/';
    const { searchUrl } = useSearch();
    const uploadResource = '/upload-resource';
    const activity = '/account/activity';
    const userDetail = '/users/[id]';

    const getNavbarValue = (): number | null => {
        switch (pathname) {
            case home: {
                return 1;
            }
            case searchUrl.pathname: {
                return 2;
            }
            case uploadResource: {
                return 3;
            }
            case activity: {
                return 4;
            }
            case userDetail: {
                if (user && query.id === user.id) {
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

    const handleRedirect = (url: string | UrlObject) => (): Promise<boolean> => Router.push(url);

    const renderAvatar = (
        <Link href="/users/[id]" as={`/users/${R.propOr('', 'id', user)}`}>
            <Avatar className="avatar-thumbnail" src={mediaURL(avatarThumb)} />
        </Link>
    );

    const renderHomeAction = (
        <BottomNavigationAction value={1} onClick={handleRedirect(home)} icon={<HomeOutlined />} />
    );

    const renderSearchAction = (
        <BottomNavigationAction value={2} onClick={handleRedirect(searchUrl)} icon={<SearchOutlined />} />
    );

    const renderUploadResourceAction = (
        <BottomNavigationAction value={3} onClick={handleRedirect(uploadResource)} icon={<CloudUploadOutlined />} />
    );

    const renderActivityAction = (
        <BottomNavigationAction value={4} onClick={handleRedirect(activity)} icon={<NotificationsOutlined />} />
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
