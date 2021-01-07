import { CardContent, CardHeader, Grid, makeStyles, Paper } from '@material-ui/core';
import { useMediaQueries } from 'hooks';
import { useRouter } from 'next/router';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'theme';
import { MainTemplateProps, TopNavbarProps } from 'types';
import { BackButton } from '../shared';

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

interface Props extends Omit<MainTemplateProps, 'topNavbarProps'> {
  topNavbarProps: Omit<TopNavbarProps, 'header'>;
  header: string;
}

export const FormTemplate: React.FC<Props> = ({ children, header, topNavbarProps, ...props }) => {
  const classes = useStyles();
  const router = useRouter();
  const { isTabletOrDesktop } = useMediaQueries();
  const dynamicBackUrl = topNavbarProps?.dynamicBackUrl;
  const staticBackUrl = topNavbarProps?.staticBackUrl;
  const handleBackButtonClick = () => (staticBackUrl ? router.push(staticBackUrl) : router.back());

  const layoutProps = {
    ...props,
    topNavbarProps: {
      ...topNavbarProps,
      header,
    },
  };

  const renderBackButton = (!!dynamicBackUrl || !!staticBackUrl) && (
    <BackButton onClick={handleBackButtonClick} />
  );

  const renderHeader = isTabletOrDesktop && (
    <CardHeader
      classes={{
        root: classes.cardHeaderRoot,
        avatar: classes.cardHeaderAvatar,
      }}
      title={header}
      avatar={renderBackButton}
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
