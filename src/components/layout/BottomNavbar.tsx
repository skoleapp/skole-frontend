import { BottomNavigationAction } from '@material-ui/core';
import { AccountCircleOutlined, HomeOutlined, SearchOutlined, StarOutlined } from '@material-ui/icons';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { ChangeEvent, useState } from 'react';
import { useSelector } from 'react-redux';

import { Router } from '../../i18n';
import { State } from '../../types';
import { StyledBottomNavigation } from '../shared';

export const BottomNavbar: React.FC = () => {
    const { user, authenticated } = useSelector((state: State) => state.auth);
    const { pathname, query } = useRouter();
    const home = '/';
    const search = '/search';
    const userDetail = '/users/[id]';
    const starred = '/account/starred';

    const getNavbarValue = (): number | null => {
        switch (pathname) {
            case home: {
                return 0;
            }
            case search: {
                return 1;
            }
            case userDetail: {
                if (user && query.id === user.id) {
                    return 2;
                }
            }
            case starred: {
                return 3;
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

    const handleAccountClick = (): void => {
        authenticated ? Router.push(`/users/${R.propOr('', 'id', user)}`) : '/login';
    };

    return (
        <StyledBottomNavigation value={value} onChange={handleChange}>
            <BottomNavigationAction value={1} onClick={handleRedirect(home)} icon={<HomeOutlined />} />
            <BottomNavigationAction value={2} onClick={handleRedirect(search)} icon={<SearchOutlined />} />
            <BottomNavigationAction value={3} onClick={handleRedirect(starred)} icon={<StarOutlined />} />
            <BottomNavigationAction value={4} onClick={handleAccountClick} icon={<AccountCircleOutlined />} />
        </StyledBottomNavigation>
    );
};
