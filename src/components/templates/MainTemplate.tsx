import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useMediaQueries } from 'hooks';
import * as R from 'ramda';
import React from 'react';
import {
  BOTTOM_NAVBAR_HEIGHT,
  TOP_NAVBAR_HEIGHT_DESKTOP,
  TOP_NAVBAR_HEIGHT_MOBILE,
  TOP_NAVBAR_HEIGHT_WITH_DESKTOP_NAVIGATION,
} from 'styles';
import { MainTemplateProps } from 'types';

import { BottomNavbar, Footer, Head, TopNavbar } from '../layout';

const useStyles = makeStyles(({ palette, breakpoints, spacing }) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: palette.type === 'dark' ? palette.background.default : palette.secondary.main,
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
    [breakpoints.up('md')]: {
      minHeight: '100vh',
      padding: spacing(4),
      paddingTop: `calc(${TOP_NAVBAR_HEIGHT_WITH_DESKTOP_NAVIGATION} + ${spacing(4)})`,
    },
  },
  containerHideNavigation: {
    [breakpoints.up('md')]: {
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
    [breakpoints.up('md')]: {
      paddingTop: TOP_NAVBAR_HEIGHT_WITH_DESKTOP_NAVIGATION,
    },
  },
  containerDenseHideNavigation: {
    [breakpoints.up('md')]: {
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
  hideBottomNavbar,
  hideFooter,
  footerProps,
  children,
  ...props
}) => {
  const classes = useStyles();
  const { isMobile, isTabletOrDesktop } = useMediaQueries();
  const containerFullWidth = R.propOr(false, 'fullWidth', containerProps);
  const containerDense = R.propOr(false, 'dense', containerProps);
  const hideNavigation = R.propOr(false, 'hideNavigation', topNavbarProps);

  const containerClasses = clsx(
    classes.container,
    (hideBottomNavbar || isTabletOrDesktop) && classes.disableMarginBottom,
    containerFullWidth && classes.containerFullWidth,
    containerDense && classes.containerDense,
    hideNavigation && !containerDense && classes.containerHideNavigation,
    hideNavigation && !!containerDense && classes.containerDenseHideNavigation,
  );

  const renderHead = <Head {...seoProps} />;
  const renderTopNavbar = (isMobile && customTopNavbar) || <TopNavbar {...topNavbarProps} />;

  const renderContainer = (
    <Container
      {...R.omit(['fullWidth', 'dense', 'hideNavigation'], containerProps)}
      className={containerClasses}
    >
      {children}
    </Container>
  );

  const renderBottomNavbar =
    isMobile && !hideBottomNavbar && (customBottomNavbar || <BottomNavbar />);

  const renderFooter = isTabletOrDesktop && !hideFooter && <Footer {...footerProps} />;

  return (
    <Grid container direction="column" className={classes.root} {...props}>
      {renderHead}
      {renderTopNavbar}
      {renderContainer}
      {renderBottomNavbar}
      {renderFooter}
    </Grid>
  );
};
