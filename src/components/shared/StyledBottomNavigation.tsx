import { BottomNavigation } from '@material-ui/core';
import styled from 'styled-components';

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
        padding: 0 !important;
    }
`;
