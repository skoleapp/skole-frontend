import { Dialog } from '@material-ui/core';
import styled from 'styled-components';

export const StyledDialog = styled(Dialog)`
    text-align: center;

    .MuiListItem-root {
        cursor: pointer;

        &:hover {
            background-color: var(--hover-opacity);
        }

        .MuiListItemText-primary {
            display: flex;
            align-items: center;

            .MuiSvgIcon-root {
                margin-right: 0.5rem;
            }
        }
    }

    .MuiDialogActions-root {
        margin: auto;
    }
`;
