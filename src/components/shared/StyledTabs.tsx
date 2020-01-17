import { Tabs } from '@material-ui/core';
import styled from 'styled-components';

export const StyledTabs = styled(Tabs)`
    width: 100%;

    .MuiTab-root {
        flex-grow: 1;
    }

    .MuiTabs-scrollButtons {
        color: var(--primary);
    }
`;
