import { AppBar, Box, Toolbar } from '@material-ui/core';
import { AccountCircle, ArrowBack, CloudUpload, Settings } from '@material-ui/icons';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Heading, Logo, SearchWidget } from '.';
import { State } from '../../interfaces';
import { breakpoints } from '../../styles';
import { ButtonLink, IconButtonLink } from '../shared';

interface Props {
  heading?: string;
  backUrl?: string;
  t: (value: string) => any;
}

export const TopNavbar: React.FC<Props> = ({ heading, backUrl, t }) => {
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
        <SearchWidget t={t} />
        {authenticated ? (
          <IconButtonLink icon={AccountCircle} href="/profile" color="secondary" />
        ) : (
          <>
            <ButtonLink href="/auth/login" color="secondary">
              {t('buttonSignIn')}
            </ButtonLink>
            <ButtonLink href="/auth/register" color="secondary">
              {t('buttonRegister')}
            </ButtonLink>
          </>
        )}
      </Box>
      <IconButtonLink icon={Settings} href="/settings" color="secondary" />
    </>
  );

  return (
    <StyledTopNavBar position="sticky">
      <Toolbar variant="dense">
        {renderLeftSection}
        {renderMidSection}
        {renderRightSection}
      </Toolbar>
    </StyledTopNavBar>
  );
};

const StyledTopNavBar = styled(AppBar)`
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
