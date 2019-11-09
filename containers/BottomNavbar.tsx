import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { AccountCircle, Home, Search } from '@material-ui/icons';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { breakpoints } from '../styles';

export const BottomNavbar: React.FC = () => {
  const router = useRouter();

  const getNavbarValue = () => {
    switch (router.pathname) {
      case '/search': {
        return 0;
      }
      case '/': {
        return 1;
      }
      case '/account': {
        return 2;
      }
      default: {
        return 0;
      }
    }
  };

  const [value, setValue] = useState(getNavbarValue());

  const handleChange = (_e: ChangeEvent<HTMLButtonElement>, newValue: number): void => {
    setValue(newValue);
  };

  return (
    <StyledBottomNavbar>
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        <BottomNavigationAction
          onClick={(): Promise<boolean> => router.push('/search')}
          icon={<Search />}
        />
        <BottomNavigationAction
          onClick={(): Promise<boolean> => router.push('/')}
          icon={<Home />}
        />
        <BottomNavigationAction
          onClick={(): Promise<boolean> => router.push('/account')}
          icon={<AccountCircle />}
        />{' '}
      </BottomNavigation>
    </StyledBottomNavbar>
  );
};

const StyledBottomNavbar = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 3.25rem;

  @media only screen and (min-width: ${breakpoints.SM}) {
    display: none;
  }
`;
