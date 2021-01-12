import { CardContent, CardHeader, Grid, makeStyles, Paper } from '@material-ui/core';
import { useMediaQueries } from 'hooks';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'theme';
import { MainTemplateProps } from 'types';
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

export const FormTemplate: React.FC<MainTemplateProps> = ({
  children,
  topNavbarProps,
  ...props
}) => {
  const classes = useStyles();
  const { isTabletOrDesktop } = useMediaQueries();

  const renderHeader = isTabletOrDesktop && (
    <CardHeader
      classes={{
        root: classes.cardHeaderRoot,
        avatar: classes.cardHeaderAvatar,
      }}
      title={topNavbarProps?.header}
      avatar={topNavbarProps?.renderBackButton}
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

  const layoutProps = {
    topNavbarProps,
    ...props,
  };

  return (
    <MainTemplate {...layoutProps}>
      <Paper className={classes.root}>
        {renderHeader}
        {renderForm}
      </Paper>
    </MainTemplate>
  );
};
