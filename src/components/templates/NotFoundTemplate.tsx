import { CardHeader, makeStyles, Paper } from '@material-ui/core';
import { useTranslation } from 'lib';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'theme';

import { NotFoundBox } from '../shared';
import { MainTemplate } from './MainTemplate';

const useStyles = makeStyles(({ breakpoints }) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  cardHeader: {
    borderBottom: BORDER,
  },
}));

export const NotFoundTemplate: React.FC = () => {
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
      disableForEducatorsButton: true,
      disableSearch: true,
    },
  };

  return (
    <MainTemplate {...layoutProps}>
      <Paper className={classes.root}>
        <CardHeader className={classes.cardHeader} title={t('404:header')} />
        <NotFoundBox text={t('404:text')} />
      </Paper>
    </MainTemplate>
  );
};
