import { AppBar, Toolbar } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { ButtonLink, Logo } from '../components';
import { State } from '../interfaces';
import { breakpoints } from '../styles';
import { AuthMenu } from './AuthMenu';
import { SearchWidget } from './SearchWidget';

export const TopNavbar: React.FC = () => {
  const { authenticated } = useSelector((state: State) => state.auth);

  const renderAuthButtons = (
    <div className="auth-buttons">
      <ButtonLink href="/login" color="secondary" variant="outlined">
        login
      </ButtonLink>
      <ButtonLink href="/register" color="secondary" variant="outlined">
        Register
      </ButtonLink>
    </div>
  );

  return (
    <StyledTopNavbar>
      <AppBar position="static">
        <Toolbar>
          <Logo />
          <SearchWidget />
          {authenticated ? <AuthMenu /> : renderAuthButtons}
        </Toolbar>
      </AppBar>
    </StyledTopNavbar>
  );
};

const StyledTopNavbar = styled.div`
  flex-grow: 1;

  .auth-menu,
  .search,
  .input-input,
  .search-icon,
  .auth-buttons {
    display: none !important;

    @media only screen and (min-width: ${breakpoints.SM}) {
      display: flex !important;
    }
  }

  .auth-buttons {
    button {
      margin-left: 1rem;
    }
  }
`;
