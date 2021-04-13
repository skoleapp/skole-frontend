import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { useAuthContext } from 'context';
import React, { useMemo } from 'react';
import { BORDER, BORDER_RADIUS, useMediaQueries } from 'styles';
import { MainTemplateProps } from 'types';

import { Emoji } from '../shared';
import { MainTemplate } from './MainTemplate';

const useStyles = makeStyles(({ breakpoints, palette }) => ({
  root: {
    flexGrow: 1,
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  cardHeaderRoot: {
    borderBottom: BORDER,
  },
  cardHeaderTitle: {
    color: palette.text.secondary,
  },
}));

export const FormTemplate: React.FC<MainTemplateProps> = ({
  children,
  topNavbarProps,
  ...props
}) => {
  const classes = useStyles();
  const { mdUp } = useMediaQueries();
  const { userMe } = useAuthContext();
  const header = topNavbarProps?.header;
  const emoji = topNavbarProps?.emoji;

  const renderEmoji = useMemo(() => !!emoji && <Emoji emoji={emoji} />, [emoji]);

  const renderHeaderTitle = useMemo(
    () => (
      <>
        {header}
        {renderEmoji}
      </>
    ),
    [header, renderEmoji],
  );

  const renderHeader = useMemo(
    () =>
      mdUp && (
        <CardHeader
          classes={{
            root: classes.cardHeaderRoot,
            title: classes.cardHeaderTitle,
          }}
          title={renderHeaderTitle}
        />
      ),
    [classes.cardHeaderRoot, classes.cardHeaderTitle, renderHeaderTitle, mdUp],
  );

  const renderForm = useMemo(
    () => (
      <CardContent>
        <Grid container justify="center">
          <Grid item xs={12} sm={10} md={6}>
            {children}
          </Grid>
        </Grid>
      </CardContent>
    ),
    [children],
  );

  const layoutProps = {
    topNavbarProps,
    hideBottomNavbar: !userMe,
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
