import { Tooltip } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

import { breakpoints } from '../../styles';

export const StyledTooltip = styled(props => <Tooltip {...props} PopperProps={{ className: 'styled-tooltip' }} />)`
    .styled-tooltip {
        @media only screen and (max-width: ${breakpoints.MD}) {
            display: none !important;
        }
    }
`;
