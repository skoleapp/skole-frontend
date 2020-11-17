import { CardHeader, makeStyles, Paper } from '@material-ui/core';
import { useTranslation } from 'lib';
import React from 'react';
import { BORDER_RADIUS } from 'theme';

import { NotFoundBox } from '../shared';
import { MainLayout } from './MainLayout';

const useStyles = makeStyles(({ breakpoints }) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    [breakpoints.up('lg')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
}));

export const NotFoundLayout: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const layoutProps = {
    seoProps: {
      title: t('404:title'),
      description: t('404:description'),
    },
    topNavbarProps: {
      dynamicBackUrl: true,
      disableAuthButtons: true,
    },
  };

  return (
    <MainLayout {...layoutProps}>
      <Paper className={classes.root}>
        <CardHeader title={t('404:header')} />
        <NotFoundBox text={t('404:text')} />
      </Paper>
    </MainLayout>
  );
};
