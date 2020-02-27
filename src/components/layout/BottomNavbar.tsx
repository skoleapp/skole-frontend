import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { AccountCircle, Home, Search } from '@material-ui/icons';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { ChangeEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { Router } from '../../i18n';
import { breakpoints } from '../../styles';
import { State } from '../../types';

export const BottomNavbar: React.FC = () => {
    const { user, authenticated } = useSelector((state: State) => state.auth);
    const { pathname, query } = useRouter();

    const getNavbarValue = (): number | null => {
        switch (pathname) {
            case '/': {
                return 0;
            }
            case '/search': {
                return 1;
            }
            case '/users/[id]': {
                if (user && query.id === user.id) {
                    return 2;
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

    const handleAccountClick = (): void => {
        authenticated ? Router.push(`/users/${R.propOr('', 'id', user)}`) : '/login';
    };

    return (
        <StyledBottomNavbar value={value} onChange={handleChange}>
            <BottomNavigationAction onClick={handleRedirect('/')} icon={<Home />} />
            <BottomNavigationAction onClick={handleRedirect('/search')} icon={<Search />} />
            <BottomNavigationAction onClick={handleAccountClick} icon={<AccountCircle />} />
        </StyledBottomNavbar>
    );
};

const StyledBottomNavbar = styled(BottomNavigation)`
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 3rem !important;
    border-top: var(--border);
    z-index: 1000;

    .MuiButtonBase-root,
    .Mui-selected {
        padding: 0 !important;
    }

    @media only screen and (min-width: ${breakpoints.MD}) {
        display: none !important;
    }
`;
