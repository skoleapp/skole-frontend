import { Box, IconButton, Typography } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React from 'react';

interface Props {
    onClick: () => void;
    title?: string;
}

export const ModalHeader: React.FC<Props> = ({ onClick, title }) => (
    <Box display="flex" justifyContent="space-between" alignItems="center" borderBottom="var(--border)">
        {!!title && <Typography variant="h2">{title}</Typography>}
        <IconButton onClick={onClick}>
            <Close />
        </IconButton>
    </Box>
);
