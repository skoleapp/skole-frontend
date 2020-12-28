import { Grid, IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { CloseOutlined } from '@material-ui/icons';
import { useTranslation } from 'lib';
import React from 'react';
import { TOP_NAVBAR_HEIGHT_MOBILE } from 'theme';
import { DialogHeaderProps } from 'types';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    padding: spacing(2),
    minHeight: TOP_NAVBAR_HEIGHT_MOBILE,
  },
}));

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  text,
  onCancel,
  headerLeft,
  headerCenter,
  headerRight,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const renderCloseButton = (
    <Tooltip title={t('common:close')}>
      <IconButton onClick={onCancel} size="small">
        <CloseOutlined />
      </IconButton>
    </Tooltip>
  );

  const renderHeaderText = (
    <Typography className="MuiCardHeader-title" variant="h5">
      {text}
    </Typography>
  );

  return (
    <Grid container className={classes.root}>
      <Grid item xs={2} sm={1} container justify="flex-start" alignItems="flex-start">
        {headerLeft}
      </Grid>
      <Grid item xs={8} sm={10} container justify="center" alignItems="center">
        {headerCenter || renderHeaderText}
      </Grid>
      <Grid item xs={2} sm={1} container justify="flex-end" alignItems="flex-start">
        {headerRight || renderCloseButton}
      </Grid>
    </Grid>
  );
};
