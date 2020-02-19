import { Box, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React from 'react';

interface Props {
    onClick: () => void;
}

export const ModalHeader: React.FC<Props> = ({ onClick }) => (
    <Box display="flex" justifyContent="flex-end" borderBottom="var(--border)">
        <IconButton onClick={onClick}>
            <Close />
        </IconButton>
    </Box>
);
