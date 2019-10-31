import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { AccountCircle, Home } from '@material-ui/icons';
import SearchIcon from '@material-ui/icons/Search';
import Router from 'next/router';
import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { breakpoints } from '../../styles';

export const BottomNavbar: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_e: ChangeEvent<HTMLButtonElement>, newValue: number): void => {
    setValue(newValue);
  };

  return (
    <StyledBottomNavbar>
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        <BottomNavigationAction
          onClick={(): Promise<boolean> => Router.push('/search')}
          icon={<SearchIcon />}
        />
        <BottomNavigationAction
          onClick={(): Promise<boolean> => Router.push('/')}
          icon={<Home />}
        />
        <BottomNavigationAction
          onClick={(): Promise<boolean> => Router.push('/account')}
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
