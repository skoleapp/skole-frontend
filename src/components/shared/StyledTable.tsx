import { Paper } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

import { breakpoints } from '../../styles';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StyledTable = styled(({ disableBoxShadow, ...other }) => <Paper {...other} />)`
    flex-grow: 1;
    box-shadow: ${({ disableBoxShadow }): string => (disableBoxShadow ? 'none !important' : 'inherit')};
    position: relative;

    .MuiTableContainer-root {
        @media only screen and (min-width: ${breakpoints.MD}) {
            bottom: 3.5rem;
            position: absolute;
            top: 0;
        }

        .MuiTable-root {
            .MuiTableBody-root {
                tr {
                    &:hover {
                        background-color: var(--hover-opacity);
                    }

                    .MuiTableCell-root {
                        cursor: pointer;
                    }

                    td {
                        padding: 0.75rem;

                        .MuiTypography-subtitle1 {
                            font-size: 0.85rem;
                        }
                    }
                }
            }
        }
    }

    .MuiTablePagination-root {
        width: 100%;
        border-top: var(--border);

        @media only screen and (min-width: ${breakpoints.MD}) {
            height: 3.5rem;
            position: absolute;
            bottom: 0;
        }

        .MuiTablePagination-toolbar {
            display: flex;

            @media only screen and (max-width: ${breakpoints.MD}) {
                flex-direction: column;
                padding: 0.5rem;
                margin-top: auto;
            }
        }
    }
`;
