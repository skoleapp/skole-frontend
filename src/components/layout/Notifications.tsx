import { IconButton, Snackbar } from '@material-ui/core';
import React, { SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Close } from '@material-ui/icons';
import { State } from '../../types';
import { breakpoints } from '../../styles';
import { closeNotification } from '../../actions';
import styled from 'styled-components';

export const Notifications: React.FC = () => {
    const { open, message } = useSelector((state: State) => state.notification);
    const dispatch = useDispatch();

    const handleClose = (_e: SyntheticEvent | MouseEvent, reason?: string): void => {
        if (reason !== 'clickaway') {
            dispatch(closeNotification());
        }
    };

    return (
        <StyledNotifications
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            open={open}
            autoHideDuration={2000}
            onClose={handleClose}
            ContentProps={{
                'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{message}</span>}
            action={[
                <IconButton key="close" color="inherit" onClick={handleClose}>
                    <Close />
                </IconButton>,
            ]}
        />
    );
};

const StyledNotifications = styled(Snackbar)`
    @media only screen and (max-width: ${breakpoints.SM}) {
        margin-bottom: 3rem;
    }
`;
