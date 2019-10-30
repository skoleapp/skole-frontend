import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { AccountCircle, Backup, PermIdentity } from '@material-ui/icons';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SearchIcon from '@material-ui/icons/Search';
import Router from 'next/router';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { State } from '../../interfaces';
import { breakpoints } from '../../styles';

export const BottomNavbar: React.FC = () => {
  const [value, setValue] = useState(0);
  const { authenticated } = useSelector((state: State) => state.auth);

  return (
    <StyledBottomNavbar>
      <BottomNavigation
        value={value}
        onChange={(_e, newValue): void => setValue(newValue)}
        showLabels
      >
        <BottomNavigationAction
          onClick={(): Promise<boolean> => Router.push('/search')}
          icon={<SearchIcon />}
        />
        <BottomNavigationAction
          onClick={(): Promise<boolean> => Router.push('/upload-resource')}
          icon={<Backup />}
        />
        {authenticated && (
          <BottomNavigationAction
            onClick={(): Promise<boolean> => Router.push('/account/courses')}
            icon={<FavoriteIcon />}
          />
        )}
        {authenticated && (
          <BottomNavigationAction
            onClick={(): Promise<boolean> => Router.push('/account')}
            icon={<AccountCircle />}
          />
        )}
        {!authenticated && (
          <BottomNavigationAction
            onClick={(): Promise<boolean> => Router.push('/login')}
            icon={<PermIdentity />}
          />
        )}
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
