import { Tooltip, TooltipProps, Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

import { breakpoints } from '../../styles';

interface Props extends TooltipProps {
    title: React.ReactNode;
}

export const StyledTooltip: React.FC<Props> = ({ children, title, ...props }) => (
    <ExtraStyledTooltip
        PopperProps={{ className: 'md-up' }}
        {...props}
        title={<Typography variant="body2">{title}</Typography>}
    >
        <span>{children}</span>
    </ExtraStyledTooltip>
);

const ExtraStyledTooltip = styled(Tooltip)`
    .md-up {
        @media only screen and (max-width: ${breakpoints.MD}) {
            display: none !important;
        }
    }
`;
