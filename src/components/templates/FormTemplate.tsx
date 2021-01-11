import { CardContent, CardHeader, Grid, makeStyles, Paper } from '@material-ui/core';
import { useMediaQueries } from 'hooks';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'theme';
import { FormTemplateProps } from 'types';
import { DynamicBackButton } from '../shared';

import { MainTemplate } from './MainTemplate';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
  root: {
    flexGrow: 1,
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  cardHeaderRoot: {
    borderBottom: BORDER,
    position: 'relative',
    padding: spacing(3),
  },
  cardHeaderAvatar: {
    position: 'absolute',
    top: spacing(2),
    left: spacing(2),
  },
}));

export const FormTemplate: React.FC<FormTemplateProps> = ({
  children,
  header,
  topNavbarProps,
  ...props
}) => {
  const classes = useStyles();
  const { isTabletOrDesktop } = useMediaQueries();

  const layoutProps = {
    ...props,
    topNavbarProps: {
      ...topNavbarProps,
      header,
    },
  };

  const renderDynamicBackButton = !!topNavbarProps?.dynamicBackUrl && <DynamicBackButton />;

  const renderHeader = isTabletOrDesktop && (
    <CardHeader
      classes={{
        root: classes.cardHeaderRoot,
        avatar: classes.cardHeaderAvatar,
      }}
      title={header}
      avatar={renderDynamicBackButton}
    />
  );

  const renderForm = (
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
        {renderHeader}
        {renderForm}
      </Paper>
    </MainTemplate>
  );
};
