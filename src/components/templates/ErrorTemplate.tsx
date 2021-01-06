import { CardHeader, makeStyles, Paper } from '@material-ui/core';
import { useTranslation } from 'lib';
import React from 'react';
import { BORDER_RADIUS } from 'theme';

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
}));

export const ErrorTemplate: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const layoutProps = {
    seoProps: {
      title: t('_error:title'),
      description: t('_error:description'),
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
        <CardHeader title={t('_error:header')} />
        <NotFoundBox text={t('_error:text')} />
      </Paper>
    </MainTemplate>
  );
};
