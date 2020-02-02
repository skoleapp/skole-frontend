import { Box, BoxProps } from '@material-ui/core';
import React from 'react';

interface TabPanelProps extends BoxProps {
    index: number;
    value: number;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...props }) => (
    <Box role="tabpanel" hidden={value !== index} {...props}>
        {value === index && (
            <Box flexGrow="1" display="flex" flexDirection="column">
                {children}
            </Box>
        )}
    </Box>
);
