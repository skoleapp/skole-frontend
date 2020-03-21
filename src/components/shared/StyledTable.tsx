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
        position: absolute;
        top: 0;

        @media only screen and (max-width: ${breakpoints.MD}) {
            height: 100%;
        }

        @media only screen and (min-width: ${breakpoints.MD}) {
            bottom: 3.5rem;
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
        position: absolute;
        bottom: 0;
        height: 3.5rem;
        width: 100%;
        border-top: var(--border);
    }
`;
