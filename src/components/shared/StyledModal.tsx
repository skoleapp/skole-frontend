import { Backdrop, Modal } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

import { breakpoints } from '../../styles';

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

        ::-webkit-scrollbar {
            display: none;
        }

        @media only screen and (min-width: ${breakpoints.MD}) {
            height: ${({ autoHeight }): string => (!!autoHeight ? 'auto' : '100%')};
            max-width: 25rem;
            max-height: 50rem;
            padding: 0.5rem;
        }

        .modal-input-area {
            display: flex;
            align-items: center;
            margin: 0.5rem;
            margin-top: auto;

            @media only screen and (min-width: ${breakpoints.MD}) {
                margin: 0.5rem 0 0 0 !important;
            }
        }

        .attachment-container {
            padding: 0.5rem 0;
            display: flex;
            justify-content: center;
            background-color: var(--light-opacity);
        }
    }
`;
