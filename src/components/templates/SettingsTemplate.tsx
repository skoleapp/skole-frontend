import { CardContent, CardHeader, Grid, makeStyles, Paper } from '@material-ui/core';
import clsx from 'clsx';
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
    display: 'flex',
    width: '100%',
    [breakpoints.down('md')]: {
      margin: 0,
    },
  },
  paperContainer: {
    overflow: 'hidden',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  disablePadding: {
    padding: '0 !important',
  },
  cardHeader: {
    borderBottom: BORDER,
  },
}));

interface Props extends Omit<MainTemplateProps, 'topNavbarProps'> {
  topNavbarProps: Omit<TopNavbarProps, 'header' | 'headerRight'>;
  header: string;
  headerRight?: JSX.Element;
  form?: boolean; // Show tighter content on the right-hand paper for forms.
  text?: boolean; // Show tighter content on the right-hand paper for text content.
  disablePadding?: boolean; // Disable padding on the right-hand paper's card content.
}

export const SettingsTemplate: React.FC<Props> = ({
  topNavbarProps,
  header,
  headerRight,
  form,
  text,
  disablePadding,
  children,
  ...props
}) => {
  const classes = useStyles();
  const { renderSettingsMenuList } = useSettings(false);
  const { t } = useTranslation();
  const { isMobile, isTabletOrDesktop } = useMediaQueries();

  const formColSpan = {
    xs: 12,
    sm: 8,
    md: 6,
    lg: 4,
  };

  const textColSpan = {
    xs: 12,
    sm: 10,
    md: 8,
    lg: 6,
  };

  const colSpan = form ? formColSpan : text ? textColSpan : {};
  const renderMobileSettingsButton = isMobile && <SettingsButton color="secondary" size="small" />;
  const renderHeaderRight = headerRight || renderMobileSettingsButton;

  const customTopNavbarProps = {
    ...topNavbarProps,
    header,
    headerRight: renderHeaderRight,
  };

  const renderSettingsHeader = (
    <CardHeader className={classes.cardHeader} title={t('common:settings')} />
  );

  const renderSettingsCard = isTabletOrDesktop && (
    <Grid item xs={12} md={4} lg={3} className={classes.container}>
      <Paper className={clsx(classes.container, classes.paperContainer)}>
        {renderSettingsHeader}
        {renderSettingsMenuList}
      </Paper>
    </Grid>
  );

  const renderHeader = isTabletOrDesktop && (
    <CardHeader className={classes.cardHeader} title={header} action={renderHeaderRight} />
  );

  const renderContent = (
    <CardContent className={clsx(classes.container, disablePadding && classes.disablePadding)}>
      <Grid container alignItems="center" className={classes.container}>
        <Grid item container direction="column" xs={12} className={classes.container} {...colSpan}>
          {children}
        </Grid>
      </Grid>
    </CardContent>
  );

  const renderContentCard = (
    <Grid
      item
      xs={12}
      md={8}
      lg={9}
      container
      className={clsx(classes.container, isMobile && classes.disablePadding)}
    >
      <Paper className={clsx(classes.container, classes.paperContainer)}>
        {renderHeader}
        {renderContent}
      </Paper>
    </Grid>
  );

  return (
    <MainTemplate {...props} topNavbarProps={customTopNavbarProps}>
      <Grid container spacing={2} className={classes.root}>
        {renderSettingsCard}
        {renderContentCard}
      </Grid>
    </MainTemplate>
  );
};
