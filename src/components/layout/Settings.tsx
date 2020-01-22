import { Backdrop, Box, Fade, IconButton, Modal, Paper } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import styled from 'styled-components';

import { toggleSettings } from '../../actions';
import { breakpoints } from '../../styles';
import { State } from '../../types';
import { useSettings } from '../../utils';

export const Settings: React.FC = () => {
    const { open } = useSelector((state: State) => state.settings);
    const { renderSettingsCardContent } = useSettings({ modal: true });
    const dispatch = useDispatch();
    const handleClose = (): AnyAction => dispatch((toggleSettings(false) as unknown) as AnyAction);

    const renderCloseIcon = (
        <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={handleClose}>
                <Close />
            </IconButton>
        </Box>
    );

    return (
        <StyledSettings
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
            <Fade in={open}>
                <Paper>
                    {renderCloseIcon}
                    {renderSettingsCardContent}
                </Paper>
            </Fade>
        </StyledSettings>
    );
};

const StyledSettings = styled(Modal)`
    display: flex;
    justify-content: center;
    align-items: center;

    .MuiPaper-root {
        outline: none;
        padding: 0.5rem;
        height: 100%;
        width: 100%;

        @media only screen and (max-width: ${breakpoints.MD}) {
            overflow-y: scroll;
        }

        @media only screen and (min-width: ${breakpoints.MD}) {
            height: auto;
            max-width: 25rem;
        }
    }
`;
