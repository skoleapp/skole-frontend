import { Avatar, BottomNavigationAction } from '@material-ui/core';
import { CloudUploadOutlined, HomeOutlined, SearchOutlined, StarBorderOutlined } from '@material-ui/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { ChangeEvent, useState } from 'react';

import { Router } from '../../i18n';
import { useAuth } from '../../lib';
import { mediaURL } from '../../utils';
import { StyledBottomNavigation } from '../shared';

export const BottomNavbar: React.FC = () => {
    const { user } = useAuth();
    const avatarThumb = R.propOr('', 'avatar', user) as string;
    const { pathname, query } = useRouter();
    const home = '/';
    const search = '/search';
    const uploadResource = '/upload-resource';
    const starred = '/account/starred';
    const userDetail = '/users/[id]';

    const getNavbarValue = (): number | null => {
        switch (pathname) {
            case home: {
                return 1;
            }
            case search: {
                return 2;
            }
            case uploadResource: {
                return 3;
            }
            case starred: {
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

    const handleRedirect = (href: string) => (): Promise<boolean> => Router.push(href);

    const renderAvatar = (
        <Link href="/users/[id]" as={`/users/${R.propOr('', 'id', user)}`}>
            <Avatar className="avatar-thumbnail" src={mediaURL(avatarThumb)} />
        </Link>
    );

    return (
        <StyledBottomNavigation value={value} onChange={handleChange}>
            <BottomNavigationAction value={1} onClick={handleRedirect(home)} icon={<HomeOutlined />} />
            <BottomNavigationAction value={2} onClick={handleRedirect(search)} icon={<SearchOutlined />} />
            <BottomNavigationAction value={3} onClick={handleRedirect(uploadResource)} icon={<CloudUploadOutlined />} />
            <BottomNavigationAction value={4} onClick={handleRedirect(starred)} icon={<StarBorderOutlined />} />
            <BottomNavigationAction value={5} icon={renderAvatar} />
        </StyledBottomNavigation>
    );
};
