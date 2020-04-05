import { Box } from '@material-ui/core';
import React from 'react';

export const NavbarContainer: React.FC = ({ children }) => (
    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" padding="0 1rem">
        {children}
    </Box>
);
