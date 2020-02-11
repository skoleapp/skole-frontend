import { IconButton, Snackbar, SnackbarOrigin } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React, { SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { toggleNotification } from '../../actions';
import { breakpoints } from '../../styles';
import { State } from '../../types';

export const Notifications: React.FC = () => {
    const { notification } = useSelector((state: State) => state.ui);
    const dispatch = useDispatch();

    const handleClose = (_e: SyntheticEvent | MouseEvent, reason?: string): void => {
        if (reason !== 'clickaway') {
            dispatch(toggleNotification(null));
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
        <StyledNotifications
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

const StyledNotifications = styled(Snackbar)`
    @media only screen and (max-width: ${breakpoints.SM}) {
        margin-bottom: 3rem;
    }
`;
