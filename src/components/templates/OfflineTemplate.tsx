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

export const OfflineTemplate: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const layoutProps = {
    seoProps: {
      title: t('offline:title'),
      description: t('offline:description'),
    },
    topNavbarProps: {
      dynamicBackUrl: true,
      hideSearch: true,
      hideAuthButtons: true,
      hideForEducatorsButton: true,
      hideLanguageButton: true,
    },
  };

  return (
    <MainTemplate {...layoutProps}>
      <Paper className={classes.root}>
        <CardHeader className={classes.cardHeader} title={t('offline:header')} />
        <NotFoundBox text={t('offline:text')} />
      </Paper>
    </MainTemplate>
  );
};
