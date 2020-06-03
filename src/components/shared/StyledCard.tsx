import { Card } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

import { breakpoints } from '../../styles';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StyledCard = styled(({ scrollable, marginLeft, ...other }) => <Card {...other} />)`
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

        // .MuiCardHeader-action {
        //     margin: 0;

        //     .MuiButtonBase-root {
        //         padding: 0.25rem;
        //     }
        // }

        // .MuiCardHeader-subheader {
        //     .MuiTypography-root {
        //         font-size: 0.85rem;
        //     }
        // }
    }
`;
