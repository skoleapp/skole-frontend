import {
  CardContent,
  CardHeader,
  Grid,
  makeStyles,
  Paper,
} from '@material-ui/core';
import { useMediaQueries } from 'hooks';
import React from 'react';
import { BORDER_RADIUS } from 'theme';
import { MainTemplateProps, TopNavbarProps } from 'types';

import { MainTemplate } from './MainTemplate';

const useStyles = makeStyles(({ breakpoints }) => ({
  root: {
    flexGrow: 1,
    [breakpoints.up('lg')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
}));

interface Props extends Omit<MainTemplateProps, 'topNavbarProps'> {
  topNavbarProps: Omit<TopNavbarProps, 'header'>;
  header: string;
}

export const FormTemplate: React.FC<Props> = ({
  children,
  header,
  ...props
}) => {
  const classes = useStyles();
  const { isDesktop } = useMediaQueries();

  const layoutProps = {
    ...props,
    topNavbarProps: {
      ...props.topNavbarProps,
      header,
    },
  };

  const renderCardHeader = isDesktop && <CardHeader title={header} />;

  const renderCardContent = (
    <CardContent>
      <Grid container justify="center">
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
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