import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { MainTemplateProps } from 'types';

import { MainTemplate } from './MainTemplate';

const useStyles = makeStyles({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  children: {
    position: 'relative',
    flexGrow: 1,
  },
});

interface Props extends MainTemplateProps {
  hideLogo?: boolean;
}

export const LandingPageTemplate: React.FC<Props> = ({
  children,
  topNavbarProps,
  containerProps,
  hideLogo,
  ...props
}) => {
  const classes = useStyles();

  const renderChildren = (
    <Grid className={classes.children} container direction="column">
      {children}
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
        {renderChildren}
      </Grid>
    </MainTemplate>
  );
};
