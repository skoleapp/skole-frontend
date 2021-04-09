import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import * as R from 'ramda';
import React, { useMemo } from 'react';
import {
  BOTTOM_NAVBAR_HEIGHT,
  TOP_NAVBAR_HEIGHT_DESKTOP,
  TOP_NAVBAR_HEIGHT_MOBILE,
  useMediaQueries,
} from 'styles';
import { MainTemplateProps } from 'types';

import { BottomNavbar, Footer, HeadComponent as Head, TopNavbar } from '../layout';

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
  const { smDown, mdUp } = useMediaQueries();
  const containerFullWidth = R.propOr(false, 'fullWidth', containerProps);
  const containerDense = R.propOr(false, 'dense', containerProps);

  const containerClasses = clsx(
    classes.container,
    (hideBottomNavbar || mdUp) && classes.disableMarginBottom,
    containerFullWidth && classes.containerFullWidth,
    containerDense && classes.containerDense,
  );

  const renderHead = useMemo(() => <Head {...seoProps} />, [seoProps]);

  const renderTopNavbar = useMemo(
    () => (smDown && customTopNavbar) || <TopNavbar {...topNavbarProps} />,
    [customTopNavbar, smDown, topNavbarProps],
  );

  const renderContainer = useMemo(
    () => (
      <Container {...R.omit(['fullWidth', 'dense'], containerProps)} className={containerClasses}>
        {children}
      </Container>
    ),
    [children, containerClasses, containerProps],
  );

  const renderBottomNavbar = useMemo(
    () => smDown && !hideBottomNavbar && (customBottomNavbar || <BottomNavbar />),
    [customBottomNavbar, hideBottomNavbar, smDown],
  );

  const renderFooter = useMemo(() => mdUp && !hideFooter && <Footer {...footerProps} />, [
    footerProps,
    hideFooter,
    mdUp,
  ]);

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
