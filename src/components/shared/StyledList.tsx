import { List } from '@material-ui/core';
import styled from 'styled-components';

export const StyledList = styled(List)`
    .MuiListSubheader-root {
        text-align: left;
        outline: none;
    }

    .MuiListItem-root {
        .MuiAvatar-root {
            background-color: var(--primary);
            width: 2rem;
            height: 2rem;
        }

        .MuiListItemText-primary {
            display: flex;
            align-items: center;

            .MuiSvgIcon-root {
                margin-right: 0.5rem;
            }
        }
    }
`;
