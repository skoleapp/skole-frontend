import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { AccountCircle, ArrowBack, Favorite, Settings } from '@material-ui/icons';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { ButtonLink, IconButtonLink, Logo } from '../components';
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
        {heading ? (
          <div id="heading">
            <Typography variant="h6">{heading}</Typography>
          </div>
        ) : (
          <Logo />
        )}
        <div className="desktop-content">
          <SearchWidget />
          {authenticated ? (
            <>
              <IconButtonLink icon={Favorite} href="/profile/activity" color="secondary" />
              <IconButtonLink icon={AccountCircle} href="/profile" color="secondary" />
            </>
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
        </div>
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

  #logo,
  #heading {
    flex-grow: 1;
    margin: 0 0.5rem;
    text-align: center;

    .MuiTypography-h6 {
      width: 12rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      @media only screen and (max-width: ${breakpoints.SM}) {
        margin: 0 auto;
      }
    }

    @media only screen and (min-width: ${breakpoints.SM}) {
      text-align: left;
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
