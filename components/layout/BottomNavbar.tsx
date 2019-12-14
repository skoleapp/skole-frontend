import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { AccountCircle, Home, Search } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { Router } from '../../i18n';
import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { breakpoints } from '../../styles';

export const BottomNavbar: React.FC = () => {
  const router = useRouter();

  const getNavbarValue = () => {
    switch (router.pathname) {
      case '/': {
        return 0;
      }
      case '/search': {
        return 1;
      }
      case '/profile': {
        return 2;
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

  return (
    <StyledBottomNavbar value={value} onChange={handleChange}>
      <BottomNavigationAction onClick={handleRedirect('/')} icon={<Home />} />
      <BottomNavigationAction onClick={handleRedirect('/search')} icon={<Search />} />
      <BottomNavigationAction onClick={handleRedirect('/profile')} icon={<AccountCircle />} />
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
