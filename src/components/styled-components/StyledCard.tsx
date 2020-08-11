import { Card } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { breakpoints } from 'styles';

// Ignore: scrollable and marginLeft must be omitted from Box props.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StyledCard = styled(({ scrollable, marginLeft, onlyHeader, ...props }) => <Card {...props} />)`
    flex-grow: 1;
    overflow-y: ${({ scrollable }): string => (scrollable ? 'scroll !important' : 'inherit')};
    display: flex;
    flex-direction: column;

    @media only screen and (min-width: ${breakpoints.MD}) {
        margin-left: ${({ marginLeft }): string => (!!marginLeft ? '0.5rem' : '0')};
    }

    .MuiCardHeader-root,
    .MuiCardContent-root {
        padding: 0.5rem;
    }

    .MuiCardHeader-root {
        height: ${({ onlyHeader }): string | false => !onlyHeader && '3rem'};
    }
`;
