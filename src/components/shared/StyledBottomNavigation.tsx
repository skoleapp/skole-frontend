import { BottomNavigation } from '@material-ui/core';
import styled from 'styled-components';

import { breakpoints } from '../../styles';

export const StyledBottomNavigation = styled(BottomNavigation)`
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 3rem !important;
    border-top: var(--border);
    z-index: 1000;
    padding: 0.5rem 1rem;

    .MuiButtonBase-root,
    .Mui-selected {
        padding: 0 !important;
    }

    @media only screen and (min-width: ${breakpoints.MD}) {
        display: none !important;
    }
`;
