import { AppBar, Toolbar } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { BackArrow, ButtonLink, Logo } from '../components';
import { State } from '../interfaces';
import { breakpoints } from '../styles';
import { AuthMenu } from './AuthMenu';
import { SearchWidget } from './SearchWidget';

interface Props {
  backUrl?: string;
}

export const TopNavbar: React.FC<Props> = ({ backUrl }) => {
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
    <StyledTopNavbar position="sticky">
      <Toolbar variant="dense">
        {backUrl && <BackArrow backUrl={backUrl} />}
        <Logo />
        <SearchWidget />
        {authenticated ? <AuthMenu /> : renderAuthButtons}
      </Toolbar>
    </StyledTopNavbar>
  );
};

const StyledTopNavbar = styled(AppBar)`
  height: 3rem;
  display: flex;
  justify-content: center;

  @media only screen and (min-width: ${breakpoints.SM}) {
    height: 4rem;
  }

  .search-widget,
  .auth-menu,
  .auth-buttons {
    @media only screen and (max-width: ${breakpoints.SM}) {
      display: none !important;
    }
  }

  .auth-buttons {
    .MuiButton-root {
      margin: 0 0.5rem;
    }
  }
`;
