import { Card } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StyledCard = styled(({ scrollable, marginLeft, ...other }) => <Card {...other} />)`
    flex-grow: 1;
    overflow-y: ${({ scrollable }): string => (scrollable ? 'scroll !important' : 'inherit')};
    margin-left: ${({ marginLeft }): string => (!!marginLeft ? '0.5rem' : '0')};
    display: flex;
    flex-direction: column;

    .MuiCardHeader-root,
    .MuiCardContent-root {
        padding: 0.5rem !important;

        .MuiCardHeader-action {
            margin: 0;

            .MuiButtonBase-root {
                padding: 0.25rem;
            }
        }
    }
`;
