import { Box, Typography } from '@material-ui/core';
import React from 'react';

interface Props {
    text: string;
}

export const NotFoundBox: React.FC<Props> = ({ text }) => (
    <Box
        flexGrow="1"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        padding="0.5rem"
    >
        <Typography variant="body2" color="textSecondary">
            {text}
        </Typography>
    </Box>
);
