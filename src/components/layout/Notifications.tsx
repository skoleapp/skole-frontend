import { IconButton, makeStyles, Snackbar, SnackbarOrigin } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { useNotificationsContext } from 'context';
import Router from 'next/router';
import React, { SyntheticEvent } from 'react';
import { BOTTOM_NAVBAR_HEIGHT } from 'theme';

const useStyles = makeStyles(({ breakpoints }) => ({
    root: {
        [breakpoints.down('sm')]: {
            marginBottom: BOTTOM_NAVBAR_HEIGHT, // Prevent showing notifications on top of bottom navbar.
        },
    },
}));

export const Notifications: React.FC = () => {
    const classes = useStyles();
    const { notification, toggleNotification } = useNotificationsContext();
    Router.events.on('routeChangeComplete', () => toggleNotification(null));

    const handleClose = (_e: SyntheticEvent | MouseEvent, reason?: string): void => {
        if (reason !== 'clickaway') {
            toggleNotification(null);
        }
    };

    const anchorOrigin: SnackbarOrigin = {
        vertical: 'bottom',
        horizontal: 'center',
    };

    const contentProps = {
        'aria-describedby': 'message-id',
    };

    const renderMessage = <span id="message-id">{notification}</span>;

    const renderAction = [
        <IconButton key="close" color="inherit" onClick={handleClose}>
            <Close />
        </IconButton>,
    ];

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
