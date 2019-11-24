import { AppBar, Box, Toolbar } from '@material-ui/core';
import { AccountCircle, ArrowBack, CloudUpload, Settings } from '@material-ui/icons';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { ButtonLink, Heading, IconButtonLink, Logo, SearchWidget } from '.';
import { State } from '../interfaces';
import { breakpoints } from '../styles';

interface Props {
  heading?: string;
  backUrl?: string;
}

export const TopNavbar: React.FC<Props> = ({ heading, backUrl }) => {
  const { authenticated } = useSelector((state: State) => state.auth);

  const renderLeftSection = (
    <>
      {backUrl ? (
        <IconButtonLink icon={ArrowBack} href={backUrl} color="secondary" />
      ) : (
        <IconButtonLink
          className="mobile-only"
          icon={CloudUpload}
          href="/upload-resource"
          color="secondary"
        />
      )}
    </>
  );

  const renderMidSection = (
    <Box className="text-section" display="flex" justifyContent="center">
      {heading ? <Heading text={heading} /> : <Logo />}
    </Box>
  );

  const renderRightSection = (
    <>
      <Box className="desktop-only" display="flex" alignItems="center">
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
      <IconButtonLink icon={Settings} href="/settings" color="secondary" />
    </>
  );

  return (
    <StyledTopNavbar position="sticky">
      <Toolbar variant="dense">
        {renderLeftSection}
        {renderMidSection}
        {renderRightSection}
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

  .text-section {
    flex-grow: 1;
    margin: 0 0.5rem;
    overflow: hidden;

    @media only screen and (min-width: ${breakpoints.SM}) {
      justify-content: flex-start;
    }
  }

  .MuiButton-root {
    margin: 0 0.5rem;
  }
`;
