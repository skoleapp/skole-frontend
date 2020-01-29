import { Card } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StyledCard = styled(({ scrollable, marginLeft, ...other }) => <Card {...other} />)`
    flex-grow: 1;
    overflow-y: ${({ scrollable }): string => (scrollable ? 'scroll !important' : 'inherit')};
    margin-left: ${({ marginLeft }): string => (!!marginLeft ? '0.5rem' : '0')};

    .main-avatar {
        height: 10rem;
        width: 10rem;
        margin: 1rem;
    }

    .MuiFormLabel-root {
        background-color: var(--white);
        border-radius: 0.1rem;
        padding: 0.05rem;
    }

    .label {
        font-size: 0.75rem;
    }
`;
