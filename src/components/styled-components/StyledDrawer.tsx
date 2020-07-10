import { Drawer } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { breakpoints } from 'styles';

// Ignore: fullHeight must be omitted from Box props.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StyledDrawer = styled(({ fullHeight, ...props }) => <Drawer {...props} />)`
    .MuiDrawer-paperAnchorLeft {
        min-width: 20rem;
    }

    .MuiDrawer-paperAnchorBottom {
        min-height: ${({ fullHeight }): string | false => fullHeight && '100%'};
    }

    .modal-header {
        padding-bottom: 0.5rem;
    }

    @media only screen and (min-width: ${breakpoints.MD}) {
        .MuiList-root {
            padding: 0.5rem 0 !important;
        }
    }
`;
