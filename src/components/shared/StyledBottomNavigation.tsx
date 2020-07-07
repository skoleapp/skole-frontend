import { BottomNavigation } from '@material-ui/core';
import styled from 'styled-components';

import { breakpoints } from '../../styles';

export const StyledBottomNavigation = styled(BottomNavigation)`
    position: fixed;
    bottom: 0;
    width: 100%;
    height: calc(var(--safe-area-inset-bottom) + 3rem) !important;
    border-top: var(--border);
    z-index: 1000;
    padding-bottom: var(--safe-area-inset-bottom);

    .MuiButtonBase-root,
    .Mui-selected {
        padding: 0 0.25rem !important;
    }

    .MuiBottomNavigationAction-root {
        min-width: 4rem !important;
    }

    @media only screen and (min-width: ${breakpoints.MD}) {
        display: none !important;
    }
`;
