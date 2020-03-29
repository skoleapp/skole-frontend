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

    // iOS
    padding-bottom: 0;
    padding-bottom: env(safe-area-inset-bottom, 0);

    .MuiButtonBase-root,
    .Mui-selected {
        padding: 0 !important;
    }

    @media only screen and (min-width: ${breakpoints.MD}) {
        display: none !important;
    }
`;
