import { List } from '@material-ui/core';
import styled from 'styled-components';

export const StyledList = styled(List)`
    .MuiListItem-root {
        text-align: center;
    }

    .MuiAvatar-root {
        background-color: var(--primary);
    }
`;
