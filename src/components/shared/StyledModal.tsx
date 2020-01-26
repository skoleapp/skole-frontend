import styled from 'styled-components';
import { Modal } from '@material-ui/core';
import { breakpoints } from '../../styles';

export const StyledModal = styled(Modal)`
    display: flex;
    justify-content: center;
    align-items: center;

    .MuiPaper-root {
        outline: none;
        padding: 0.5rem;
        height: 100%;
        width: 100%;

        @media only screen and (max-width: ${breakpoints.MD}) {
            overflow-y: scroll;
        }

        @media only screen and (min-width: ${breakpoints.MD}) {
            height: auto;
            max-width: 25rem;
        }
    }
`;
