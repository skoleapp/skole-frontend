import { Grid, IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { CloseOutlined } from '@material-ui/icons';
import { useTranslation } from 'lib';
import React from 'react';
import { DialogHeaderProps } from 'types';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    padding: `${spacing(2)} ${spacing(2)} ${spacing(1)} ${spacing(2)}`,
    [breakpoints.up('md')]: {
      padding: `${spacing(4)} ${spacing(4)} ${spacing(2)} ${spacing(4)}`,
    },
  },
  headerCenter: {
    padding: `0 ${spacing(2)}`,
  },
}));

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  text,
  onCancel,
  headerLeft,
  headerCenter,
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
    <Grid container alignItems="center" className={classes.root}>
      <Grid item xs={1} container justify="center">
        {headerLeft}
      </Grid>
      <Grid className={classes.headerCenter} item container xs={10} justify="center">
        {headerCenter || renderHeaderText}
      </Grid>
      <Grid item container xs={1} justify="center">
        {renderCloseButton}
      </Grid>
    </Grid>
  );
};
