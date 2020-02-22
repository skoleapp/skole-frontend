import { Backdrop, Modal } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

import { breakpoints } from '../../styles';

export const StyledModal = styled(props => (
    <Modal closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }} {...props} />
))`
    display: flex;
    justify-content: center;
    align-items: center;

    .MuiPaper-root {
        display: flex;
        flex-direction: column;
        outline: none;
        padding: 0.5rem;
        height: 100% !important;
        width: 100% !important;
        overflow-y: scroll;

        ::-webkit-scrollbar {
            display: none;
        }

        @media only screen and (min-width: ${breakpoints.MD}) {
            height: auto !important;
            max-width: 25rem;
            max-height: 50rem;
        }
    }
`;
