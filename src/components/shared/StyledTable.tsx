import { Paper } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StyledTable = styled(({ disableBoxShadow, ...other }) => <Paper {...other} />)`
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

                    .MuiTypography-subtitle1 {
                        margin-left: 1rem;
                    }
                }
            }

            td {
                padding: 0.75rem;

                .MuiTypography-subtitle1 {
                    font-size: 0.85rem;
                }
            }
        }
    }
`;
