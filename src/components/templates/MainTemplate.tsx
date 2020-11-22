import { Container, Grid, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { useMediaQueries } from 'hooks';
import * as R from 'ramda';
import React from 'react';
import { BOTTOM_NAVBAR_HEIGHT, TOP_NAVBAR_HEIGHT_DESKTOP, TOP_NAVBAR_HEIGHT_MOBILE } from 'theme';
import { MainTemplateProps } from 'types';

import {
  BottomNavbar,
  Footer,
  Head,
  LanguageSelectorDialog,
  Notifications,
  SettingsModal,
  TopNavbar,
} from '../layout';

const useStyles = makeStyles(({ palette, breakpoints, spacing }) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: palette.secondary.main,
    paddingTop: 'env(safe-area-inset-top)',
    overflow: 'hidden',
  },
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    margin: '0 auto',
    padding: 0,
    marginBottom: `calc(${BOTTOM_NAVBAR_HEIGHT} + env(safe-area-inset-bottom))`,
    paddingTop: TOP_NAVBAR_HEIGHT_MOBILE,
    [breakpoints.up('lg')]: {
      minHeight: '100vh',
      padding: spacing(4),
      paddingTop: `calc(${TOP_NAVBAR_HEIGHT_DESKTOP} + ${spacing(4)})`,
    },
  },
  disableMarginBottom: {
    marginBottom: 0,
  },
  containerDense: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingTop: TOP_NAVBAR_HEIGHT_MOBILE,
    [breakpoints.up('lg')]: {
      paddingTop: TOP_NAVBAR_HEIGHT_DESKTOP,
    },
  },
  containerFullWidth: {
    maxWidth: '100%',
  },
}));

export const MainTemplate: React.FC<MainTemplateProps> = ({
  seoProps,
  topNavbarProps,
  containerProps,
  customTopNavbar,
  customBottomNavbar,
  disableBottomNavbar,
  disableFooter,
  children,
  ...props
}) => {
  const classes = useStyles();
  const { isMobileOrTablet, isDesktop } = useMediaQueries();
  const renderHead = <Head {...seoProps} />;

  const renderTopNavbar = (isMobileOrTablet && customTopNavbar) || (
    <TopNavbar {...topNavbarProps} />
  );

  const containerFullWidth: boolean = R.propOr(false, 'fullWidth', containerProps);

  const containerDense: boolean = R.propOr(false, 'dense', containerProps);

  const containerClasses = clsx(
    classes.container,
    (disableBottomNavbar || isDesktop) && classes.disableMarginBottom,
    containerFullWidth && classes.containerFullWidth,
    containerDense && classes.containerDense,
  );

  const renderChildren = (
    <Container {...R.omit(['fullWidth', 'dense'], containerProps)} className={containerClasses}>
      {children}
    </Container>
  );

  const renderBottomNavbar =
    isMobileOrTablet && (customBottomNavbar || (!disableBottomNavbar && <BottomNavbar />));

  const renderFooter = isDesktop && !disableFooter && <Footer />;
  const renderNotifications = <Notifications />;
  const renderSettingsModal = <SettingsModal />;
  const renderLanguageSelectorModal = <LanguageSelectorDialog />;

  return (
    <Grid container direction="column" className={classes.root} {...props}>
      {renderHead}
      {renderTopNavbar}
      {renderChildren}
      {renderBottomNavbar}
      {renderFooter}
      {renderNotifications}
      {renderSettingsModal}
      {renderLanguageSelectorModal}
    </Grid>
  );
};
