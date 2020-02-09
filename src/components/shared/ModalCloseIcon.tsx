import { Box, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React from 'react';

interface Props {
    onClick: () => void;
}

export const ModalCloseIcon: React.FC<Props> = ({ onClick }) => (
    <Box display="flex" justifyContent="flex-end">
        <IconButton onClick={onClick}>
            <Close />
        </IconButton>
    </Box>
);
