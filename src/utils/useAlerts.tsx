import { Collapse, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Alert, Color } from '@material-ui/lab';
import React from 'react';
import { useState } from 'react';

interface UseAlerts {
    renderAlert: (severity: Color, text: string) => JSX.Element;
}

export const useAlerts = (): UseAlerts => {
    const [open, setOpen] = useState(true);

    const renderAction = (
        <IconButton color="inherit" size="small" onClick={(): void => setOpen(false)}>
            <Close />
        </IconButton>
    );

    const renderAlert = (severity: Color, text: string): JSX.Element => (
        <Collapse in={open}>
            <Alert severity={severity} action={renderAction}>
                {text}
            </Alert>
        </Collapse>
    );

    return { renderAlert };
};
