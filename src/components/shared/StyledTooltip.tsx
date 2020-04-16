import { Tooltip, TooltipProps, Typography } from '@material-ui/core';
import React from 'react';

interface Props extends TooltipProps {
    title: React.ReactNode;
}

export const StyledTooltip: React.FC<Props> = ({ children, title, ...props }) => (
    <Tooltip PopperProps={{ className: 'md-up' }} {...props} title={<Typography variant="body2">{title}</Typography>}>
        <span>{children}</span>
    </Tooltip>
);
