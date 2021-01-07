import { CardContent, CardHeader, Grid, makeStyles, Paper } from '@material-ui/core';
import { useMediaQueries, useSettings } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'theme';
import { MainTemplateProps, TopNavbarProps } from 'types';

import { SettingsButton } from '../shared';
import { MainTemplate } from './MainTemplate';

const useStyles = makeStyles(({ breakpoints }) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    display: 'flex',
  },
  paper: {
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
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
  topNavbarProps: Omit<TopNavbarProps, 'header' | 'headerRight'>;
  header: string;
}

export const SettingsTemplate: React.FC<Props> = ({
  topNavbarProps,
  header,
  children,
  ...props
}) => {
  const classes = useStyles();
  const { renderSettingsMenuList } = useSettings(false);
  const { t } = useTranslation();
  const { isMobile, isTabletOrDesktop } = useMediaQueries();
  const renderMobileSettingsButton = isMobile && <SettingsButton color="secondary" size="small" />;

  const customTopNavbarProps = {
    ...topNavbarProps,
    header,
    headerRight: renderMobileSettingsButton,
  };

  const renderSettingsHeader = (
    <CardHeader className={classes.cardHeader} title={t('common:settings')} />
  );

  const renderSettingsCard = isTabletOrDesktop && (
    <Grid item xs={12} md={4} lg={3} className={classes.container}>
      <Paper className={classes.paper}>
        {renderSettingsHeader}
        {renderSettingsMenuList}
      </Paper>
    </Grid>
  );

  const renderHeader = isTabletOrDesktop && (
    <CardHeader className={classes.cardHeader} title={header} />
  );

  const renderContent = (
    <CardContent className={classes.container}>
      <Grid container justify="center" className={classes.container}>
        <Grid
          item
          container
          direction="column"
          xs={12}
          sm={8}
          lg={5}
          xl={4}
          className={classes.container}
        >
          {children}
        </Grid>
      </Grid>
    </CardContent>
  );

  const renderContentCard = (
    <Grid item xs={12} md={8} lg={9} container className={classes.container}>
      <Paper className={classes.paper}>
        {renderHeader}
        {renderContent}
      </Paper>
    </Grid>
  );

  return (
    <MainTemplate {...props} topNavbarProps={customTopNavbarProps}>
      <Grid container spacing={isTabletOrDesktop ? 2 : 0} className={classes.root}>
        {renderSettingsCard}
        {renderContentCard}
      </Grid>
    </MainTemplate>
  );
};
