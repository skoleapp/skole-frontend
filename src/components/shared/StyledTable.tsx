import { Paper } from '@material-ui/core';
import styled from 'styled-components';

interface Props {
    disableBoxShadow?: boolean;
}

export const StyledTable = styled(Paper)<Props>`
    flex-grow: 1;
    box-shadow: ${({ disableBoxShadow }): string => (disableBoxShadow ? 'none !important' : 'inherit')};

    .MuiTableBody-root {
        tr {
            &:hover {
                background-color: var(--primary-opacity);
            }

            .MuiTableCell-root {
                cursor: pointer;

                &.user-cell {
                    display: flex;
                    align-items: center;

                    h6 {
                        margin-left: 1rem;
                    }
                }
            }

            td {
                padding: 0.75rem;

                h6 {
                    font-size: 0.85rem;
                }
            }
        }
    }
`;
