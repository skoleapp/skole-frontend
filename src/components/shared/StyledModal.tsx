import { Backdrop, Modal } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

import { breakpoints } from '../../styles';

// Ignore: autoHeight must be omitted from Box props.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StyledModal = styled(({ autoHeight, ...other }) => (
    <Modal closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }} {...other} />
))`
    display: flex;
    justify-content: center;
    align-items: center;

    .MuiPaper-root {
        display: flex;
        flex-direction: column;
        outline: none;
        height: 100%;
        width: 100%;
        overflow-y: scroll;
        padding: 0.5rem;
        padding-bottom: calc(var(--safe-area-inset-bottom) + 0.5rem);

        ::-webkit-scrollbar {
            display: none;
        }

        @media only screen and (min-width: ${breakpoints.MD}) {
            height: ${({ autoHeight }): string => (!!autoHeight ? 'auto' : '100%')};
            max-width: 30rem;
            max-height: 50rem;
        }

        @media only screen and (max-width: ${breakpoints.MD}) {
            border-radius: 0;
        }
    }
`;
