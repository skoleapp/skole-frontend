import { AppBar, Box, IconButton, Toolbar } from '@material-ui/core';
import { AccountCircle, ArrowBack, CloudUpload, Settings } from '@material-ui/icons';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Heading, Logo, TopNavbarSearchWidget } from '.';
import { State } from '../../interfaces';
import { breakpoints } from '../../styles';
import { ButtonLink, IconButtonLink } from '../shared';

interface Props {
  heading?: string;
  backUrl?: boolean;
  disableSearch?: boolean;
}

export const TopNavbar: React.FC<Props> = ({ heading, backUrl, disableSearch }) => {
  const { authenticated } = useSelector((state: State) => state.auth);
  const router = useRouter();
  const { t } = useTranslation();

  const renderLeftSection = (
    <>
      {backUrl ? (
        <IconButton className="mobile-only" onClick={() => router.back()} color="secondary">
          <ArrowBack />
        </IconButton>
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
      <Box className="desktop-only">
        <Logo />
      </Box>
      <Box className="mobile-only">{heading ? <Heading text={heading} /> : <Logo />}</Box>
    </Box>
  );

  const renderRightSection = (
    <>
      <Box className="desktop-only" display="flex" alignItems="center">
        {!disableSearch && <TopNavbarSearchWidget />}
        {authenticated ? (
          <IconButtonLink icon={AccountCircle} href="/profile" color="secondary" />
        ) : (
          <>
            <ButtonLink href="/auth/sign-in" color="secondary">
              {t('common:signIn')}
            </ButtonLink>
            <ButtonLink href="/auth/sign-up" color="secondary">
              {t('common:signUp')}
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
