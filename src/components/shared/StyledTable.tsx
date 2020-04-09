import { Paper } from '@material-ui/core';
import styled from 'styled-components';

import { breakpoints } from '../../styles';

export const StyledTable = styled(Paper)`
    flex-grow: 1;
    display: flex;

    .MuiTableContainer-root {
        flex-grow: 1;
        display: flex;

        .MuiTable-root {
            flex-grow: 1;
            display: flex;
            flex-direction: column;

            .MuiTableHead-root {
                display: flex;

                .MuiTableRow-root {
                    flex-grow: 1;
                    display: flex;

                    .MuiTableCell-root {
                        flex-grow: 1;
                        padding: 0.5rem;
                    }
                }
            }

            .MuiTableBody-root {
                flex-grow: 1;
                display: flex;
                flex-direction: column;

                .MuiTableRow-root {
                    display: flex;

                    &:hover {
                        background-color: var(--hover-opacity);
                    }

                    .MuiTableCell-root {
                        flex-grow: 1;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        cursor: pointer;
                        padding: 0.25rem 0.5rem;

                        .MuiTypography-subtitle1 {
                            font-size: 0.85rem;
                        }

                        .cell-help-text {
                            font-size: 0.75rem;
                        }
                    }
                }
            }

            .MuiTableFooter-root {
                display: flex;
                justify-content: center;
                border-top: var(--border);

                .MuiTablePagination-root {
                    .MuiTablePagination-toolbar {
                        @media only screen and (max-width: ${breakpoints.MD}) {
                            flex-direction: column;
                            padding: 0.5rem;
                        }
                    }
                }
            }
        }
    }
`;
