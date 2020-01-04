import * as R from 'ramda';

import { AccountCircle, Home, Search } from '@material-ui/icons';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import React, { ChangeEvent, useState } from 'react';

import { State } from '../../types';
import { breakpoints } from '../../styles';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

export const BottomNavbar: React.FC = () => {
    const { user } = useSelector((state: State) => state.auth);
    const router = useRouter();

    const getNavbarValue = (): number | null => {
        switch (router.pathname) {
            case '/': {
                return 0;
            }
            case '/search': {
                return 1;
            }
            case '/users/[id]': {
                if (user && router.query.id === user.id) {
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

    const handleRedirect = (href: string) => (): Promise<boolean> => router.push(href);

    return (
        <StyledBottomNavbar value={value} onChange={handleChange}>
            <BottomNavigationAction onClick={handleRedirect('/')} icon={<Home />} />
            <BottomNavigationAction onClick={handleRedirect('/search')} icon={<Search />} />
            <BottomNavigationAction
                onClick={handleRedirect(`/users/${R.propOr('', 'id', user)}`)}
                icon={<AccountCircle />}
            />
        </StyledBottomNavbar>
    );
};

const StyledBottomNavbar = styled(BottomNavigation)`
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 3rem !important;
    border-top: 0.05rem solid var(--grey);

    .MuiButtonBase-root,
    .Mui-selected {
        padding: 0 !important;
    }

    @media only screen and (min-width: ${breakpoints.SM}) {
        display: none !important;
    }
`;
