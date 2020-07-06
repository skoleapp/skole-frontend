import { Drawer } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

// Ignore: fullHeight must be omitted from Box props.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StyledDrawer = styled(({ fullHeight, ...props }) => <Drawer {...props} />)`
    .MuiDrawer-paperAnchorLeft {
        min-width: 20rem;
    }

    .MuiDrawer-paperAnchorBottom {
        min-height: ${({ fullHeight }): string | false => fullHeight && '100%'};
    }
`;
