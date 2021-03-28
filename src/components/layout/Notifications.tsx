import IconButton from '@material-ui/core/IconButton';
import Snackbar, { SnackbarOrigin } from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Close from '@material-ui/icons/Close';
import { useNotificationsContext } from 'context';
import Router from 'next/router';
import React, { SyntheticEvent, useCallback, useMemo } from 'react';
import { BOTTOM_NAVBAR_HEIGHT } from 'styles';

const useStyles = makeStyles(({ breakpoints }) => ({
  root: {
    [breakpoints.down('sm')]: {
      marginBottom: BOTTOM_NAVBAR_HEIGHT, // Prevent showing notifications on top of bottom navbar.
    },
    '& .MuiSnackbarContent-root': {
      borderRadius: '1rem',
      flexWrap: 'nowrap',
      overflow: 'hidden',
      '& .MuiSnackbarContent-message': {
        overflow: 'hidden',
        display: 'flex',
      },
    },
  },
}));

export const Notifications: React.FC = () => {
  const classes = useStyles();
  const { notification, toggleNotification } = useNotificationsContext();
  Router.events.on('routeChangeComplete', () => toggleNotification(null));

  const handleClose = useCallback(
    (_e: SyntheticEvent | MouseEvent, reason?: string): void => {
      if (reason !== 'clickaway') {
        toggleNotification(null);
      }
    },
    [toggleNotification],
  );

  const anchorOrigin: SnackbarOrigin = {
    vertical: 'bottom',
    horizontal: 'center',
  };

  const contentProps = {
    'aria-describedby': 'message-id',
  };

  const renderMessage = useMemo(
    () => (
      <Typography className="truncate-text" component="span">
        {notification}
      </Typography>
    ),
    [notification],
  );

  const renderAction = useMemo(
    () => [
      <IconButton key="close" color="inherit" onClick={handleClose}>
        <Close />
      </IconButton>,
    ],
    [handleClose],
  );

  return (
    <Snackbar
      className={classes.root}
      anchorOrigin={anchorOrigin}
      open={!!notification}
      autoHideDuration={2000}
      onClose={handleClose}
      ContentProps={contentProps}
      message={renderMessage}
      action={renderAction}
    />
  );
};
