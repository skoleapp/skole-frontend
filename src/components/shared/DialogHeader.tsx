import { Grid, IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { CloseOutlined } from '@material-ui/icons';
import { useTranslation } from 'lib';
import React from 'react';
import { DialogHeaderProps } from 'types';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    padding: `${spacing(2)} ${spacing(2)} ${spacing(1)} ${spacing(2)}`,
    [breakpoints.up('sm')]: {
      padding: `${spacing(3)} ${spacing(3)} ${spacing(2)} ${spacing(3)}`,
    },
  },
}));

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  text,
  onCancel,
  cancelLeft,
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

  const renderLeft = headerLeft || (cancelLeft && renderCloseButton);
  const renderCenter = headerCenter || renderHeaderText;
  const renderRight = headerRight || (!cancelLeft && renderCloseButton);

  return (
    <Grid container alignItems="center" className={classes.root}>
      <Grid item xs={2} sm={1} container justify="flex-start">
        {renderLeft}
      </Grid>
      <Grid item xs={8} sm={10} container justify="center">
        {renderCenter}
      </Grid>
      <Grid item xs={2} sm={1} container justify="flex-end">
        {renderRight}
      </Grid>
    </Grid>
  );
};
