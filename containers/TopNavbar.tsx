import { AppBar, Box, Toolbar } from '@material-ui/core';
import { AccountCircle, ArrowBack, Settings } from '@material-ui/icons';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { ButtonLink, Heading, IconButtonLink, Logo } from '../components';
import { State } from '../interfaces';
import { breakpoints } from '../styles';
import { SearchWidget } from './SearchWidget';

interface Props {
  heading?: string;
  backUrl?: string;
}

export const TopNavbar: React.FC<Props> = ({ heading, backUrl }) => {
  const { authenticated } = useSelector((state: State) => state.auth);

  return (
    <StyledTopNavbar position="sticky">
      <Toolbar variant="dense">
        {backUrl && <IconButtonLink icon={ArrowBack} href={backUrl} id="back" color="secondary" />}
        {heading ? <Heading text={heading} /> : <Logo />}
        <Box className="desktop-content">
          <SearchWidget />
          {authenticated ? (
            <IconButtonLink icon={AccountCircle} href="/profile" color="secondary" />
          ) : (
            <>
              <ButtonLink href="/login" color="secondary" variant="outlined">
                login
              </ButtonLink>
              <ButtonLink href="/register" color="secondary" variant="outlined">
                Register
              </ButtonLink>
            </>
          )}
        </Box>
        <IconButtonLink icon={Settings} href="/settings" id="settings" color="secondary" />
      </Toolbar>
    </StyledTopNavbar>
  );
};

const StyledTopNavbar = styled(AppBar)`
  height: 3rem;
  display: flex;
  justify-content: center;

  @media only screen and (min-width: ${breakpoints.MD}) {
    height: 4rem;
  }

  .desktop-content {
    display: flex;

    @media only screen and (max-width: ${breakpoints.MD}) {
      display: none !important;
    }
  }

  .MuiButton-root,
  .MuiIconButton-root {
    margin: 0 0.5rem;

    @media only screen and (max-width: ${breakpoints.SM}) {
      position: absolute;

      &#back {
        left: 0;
      }

      &#settings {
        right: 0;
      }
    }
  }
`;
