import { IconButton, Snackbar, SnackbarOrigin } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React, { SyntheticEvent } from 'react';
import styled from 'styled-components';

import { breakpoints } from '../../styles';
import { useNotificationsContext } from '../../utils';

export const Notifications: React.FC = () => {
    const { notification, toggleNotification } = useNotificationsContext();

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
        <StyledNotification
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

const StyledNotification = styled(Snackbar)`
    @media only screen and (max-width: ${breakpoints.SM}) {
        margin-bottom: 3rem;
    }
`;
