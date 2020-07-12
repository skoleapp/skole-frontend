import { Typography } from '@material-ui/core';
import React from 'react';

interface Props {
    text?: string;
}

export const StyledHeaderText: React.FC<Props> = ({ text }) => (
    <Typography variant="h2" className="truncate">
        {text}
    </Typography>
);
