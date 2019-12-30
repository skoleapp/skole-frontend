import { Box } from '@material-ui/core';
import React from 'react';

interface TabPanelProps {
    index: number;
    value: number;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...props }) => (
    <Box role="tabpanel" hidden={value !== index} {...props}>
        {value === index && <Box>{children}</Box>}
    </Box>
);
