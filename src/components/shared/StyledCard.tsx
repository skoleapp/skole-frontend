import { Card } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StyledCard = styled(({ scrollable, ...other }) => <Card {...other} />)`
    flex-grow: 1;
    overflow-y: ${({ scrollable }): string => (scrollable ? 'scroll !important' : 'inherit')};

    .main-avatar {
        height: 10rem;
        width: 10rem;
        margin: 1rem;
    }

    .label {
        font-size: 0.75rem;
    }
`;
