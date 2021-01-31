import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Image from 'next/image';
import React from 'react';
import { MainTemplateProps } from 'types';
import { isNotNativeApp } from 'utils';

import { MainBackground } from '../layout';
import { AppStoreBadge, GooglePlayBadge } from '../shared';
import { MainTemplate } from './MainTemplate';

const useStyles = makeStyles(({ spacing, breakpoints, palette }) => ({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  logoContainer: {
    position: 'relative',
    textAlign: 'center',
    padding: `${spacing(8)} ${spacing(2)}`,
    [breakpoints.up('md')]: {
      marginTop: spacing(8),
    },
  },
  logo: {
    height: '4rem',
    position: 'relative',
    [breakpoints.up('sm')]: {
      height: '5rem',
    },
    [breakpoints.up('md')]: {
      height: '6rem',
    },
  },
  children: {
    position: 'relative',
    flexGrow: 1,
  },
  appStoreBadgeContainer: {
    position: 'relative',
    backgroundColor: palette.grey[300],
    padding: spacing(4),
    paddingTop: spacing(8),
    paddingBottom: `calc(${spacing(8)} + env(safe-area-inset-bottom))`,
    [breakpoints.up('md')]: {
      paddingTop: spacing(16),
      paddingBottom: `calc(${spacing(16)} + env(safe-area-inset-bottom))`,
    },
    [breakpoints.up('lg')]: {
      paddingTop: spacing(24),
      paddingBottom: `calc(${spacing(24)} + env(safe-area-inset-bottom))`,
    },
  },
  appStoreBadgeImageContainer: {
    maxWidth: '25rem',
  },
}));

interface Props extends MainTemplateProps {
  hideLogo?: boolean;
  hideAppStoreBadges?: boolean;
}

export const LandingPageTemplate: React.FC<Props> = ({
  children,
  topNavbarProps,
  containerProps,
  hideLogo,
  hideAppStoreBadges = !isNotNativeApp,
  ...props
}) => {
  const classes = useStyles();
  const renderBackground = <MainBackground />;

  const renderHeader = !hideLogo && (
    <Box className={classes.logoContainer}>
      <Box className={classes.logo}>
        <Image layout="fill" src="/images/icons/skole-icon-text.svg" />
      </Box>
    </Box>
  );

  const renderChildren = (
    <Grid className={classes.children} container direction="column">
      {children}
    </Grid>
  );

  const renderAppStoreBadges = !hideAppStoreBadges && (
    <Grid className={classes.appStoreBadgeContainer} container justify="center" alignItems="center">
      <Grid className={classes.appStoreBadgeImageContainer} container justify="center" spacing={4}>
        <Grid item xs={6}>
          <AppStoreBadge />
        </Grid>
        <Grid item xs={6}>
          <GooglePlayBadge />
        </Grid>
      </Grid>
    </Grid>
  );

  const layoutProps = {
    hideBottomNavbar: true,
    topNavbarProps: {
      ...topNavbarProps,
      hideSearch: true,
    },
    containerProps: {
      ...containerProps,
      fullWidth: true,
      dense: true,
    },
    ...props,
  };

  return (
    <MainTemplate {...layoutProps}>
      <Grid container direction="column" className={classes.container}>
        {renderBackground}
        {renderHeader}
        {renderChildren}
        {renderAppStoreBadges}
      </Grid>
    </MainTemplate>
  );
};
