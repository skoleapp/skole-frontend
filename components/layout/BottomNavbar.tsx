import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { AccountCircle, PermIdentity } from '@material-ui/icons';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import RestoreIcon from '@material-ui/icons/Restore';
import Router from 'next/router';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { State } from '../../interfaces';
import { SM } from '../../utils';

const StyledBottomNavbar = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  border-top: 0.05rem solid var(--primary);

  @media only screen and (min-width: ${SM}) {
    display: none;
  }
`;

export const BottomNavbar: React.FC = () => {
  const [value, setValue] = useState(0);
  const { user, authenticated } = useSelector((state: State) => state.auth);

  return (
    <StyledBottomNavbar>
      <BottomNavigation
        value={value}
        onChange={(_e, newValue): void => setValue(newValue)}
        showLabels
        className="root"
      >
        <BottomNavigationAction icon={<RestoreIcon />} />
        <BottomNavigationAction icon={<LocationOnIcon />} />
        {authenticated ? (
          <>
            <BottomNavigationAction
              onClick={(): Promise<boolean> => Router.push(`/user/${user.id}`)}
              icon={<FavoriteIcon />}
            />
            <BottomNavigationAction
              onClick={(): Promise<boolean> => Router.push(`/user/${user.id}`)}
              icon={<AccountCircle />}
            />
          </>
        ) : (
          <BottomNavigationAction
            onClick={(): Promise<boolean> => Router.push('/login')}
            icon={<PermIdentity />}
          />
        )}
      </BottomNavigation>
    </StyledBottomNavbar>
  );
};
