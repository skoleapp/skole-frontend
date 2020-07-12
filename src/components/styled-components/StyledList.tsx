import { List } from '@material-ui/core';
import styled from 'styled-components';

export const StyledList = styled(List)`
    padding: 0 !important;

    .MuiListItem-root {
        .MuiListItemAvatar-root {
            min-width: 2.75rem;
        }

        .MuiAvatar-root {
            width: 2rem;
            height: 2rem;

            .MuiSvgIcon-root {
                width: 1.35rem;
                height: 1.35rem;
            }
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