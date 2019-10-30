import { AppBar, Toolbar } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { State } from '../../interfaces';
import { breakpoints } from '../../styles';
import { Logo } from '../atoms';
import { PublicAuthButtons } from '../molecules';
import { AuthMenu, SearchWidget } from '../organisms';

const StyledTopNavbar = styled.div`
  flex-grow: 1;

  .auth-menu,
  .search,
  .input-input,
  .search-icon,
  .public-auth-buttons {
    display: none !important;

    @media only screen and (min-width: ${breakpoints.SM}) {
      display: flex !important;
    }
  }
`;

export const TopNavbar: React.FC = () => {
  const { authenticated } = useSelector((state: State) => state.auth);

  return (
    <StyledTopNavbar>
      <AppBar position="static">
        <Toolbar>
          <Logo />
          <SearchWidget />
          {authenticated ? <AuthMenu /> : <PublicAuthButtons />}
        </Toolbar>
      </AppBar>
    </StyledTopNavbar>
  );
};
