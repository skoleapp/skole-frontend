import { CardContent, CardHeader, Grid, makeStyles, Paper } from '@material-ui/core';
import { useMediaQueries } from 'hooks';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'theme';
import { MainTemplateProps, TopNavbarProps } from 'types';

import { MainTemplate } from './MainTemplate';

const useStyles = makeStyles(({ breakpoints }) => ({
  root: {
    flexGrow: 1,
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  cardHeader: {
    borderBottom: BORDER,
  },
}));

interface Props extends Omit<MainTemplateProps, 'topNavbarProps'> {
  topNavbarProps: Omit<TopNavbarProps, 'header'>;
  header: string;
}

export const FormTemplate: React.FC<Props> = ({ children, header, topNavbarProps, ...props }) => {
  const classes = useStyles();
  const { isTabletOrDesktop } = useMediaQueries();

  const layoutProps = {
    ...props,
    topNavbarProps: {
      ...topNavbarProps,
      header,
    },
  };

  const renderCardHeader = isTabletOrDesktop && (
    <CardHeader className={classes.cardHeader} title={header} />
  );

  const renderCardContent = (
    <CardContent>
      <Grid container justify="center">
        <Grid item xs={12} sm={8} md={6} lg={4} xl={3}>
          {children}
        </Grid>
      </Grid>
    </CardContent>
  );

  return (
    <MainTemplate {...layoutProps}>
      <Paper className={classes.root}>
        {renderCardHeader}
        {renderCardContent}
      </Paper>
    </MainTemplate>
  );
};
