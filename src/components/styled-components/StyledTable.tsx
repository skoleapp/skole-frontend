import { Paper } from '@material-ui/core';
import styled from 'styled-components';
import { breakpoints } from 'styles';

export const StyledTable = styled(Paper)`
    flex-grow: 1;
    display: flex;

    .MuiTableContainer-root {
        flex-grow: 1;
        display: flex;
        position: relative;

        .MuiTable-root {
            flex-grow: 1;
            display: flex;
            flex-direction: column;

            .MuiTableHead-root {
                display: flex;

                @media only screen and (min-width: ${breakpoints.MD}) {
                    position: absolute;
                    top: 0;
                    height: 2.5rem;
                    width: 100%;
                }

                .MuiTableRow-root {
                    flex-grow: 1;
                    display: flex;

                    .MuiTableCell-root {
                        flex-grow: 1;
                        padding: 0.5rem;
                        display: flex;
                        align-items: center;
                    }
                }
            }

            .MuiTableBody-root {
                flex-grow: 1;
                display: flex;
                flex-direction: column;

                @media only screen and (min-width: ${breakpoints.MD}) {
                    position: absolute;
                    top: 2.5rem;
                    bottom: 4.5rem;
                    width: 100%;
                    overflow-y: scroll;
                }

                .MuiTableRow-root {
                    display: flex;
                    min-height: 2.5rem;

                    &:hover {
                        background-color: var(--hover-color);
                    }

                    .MuiTableCell-root {
                        flex-grow: 1;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        cursor: pointer;
                        padding: 0.25rem 0.5rem;
                    }
                }
            }

            .MuiTableFooter-root {
                display: flex;
                justify-content: center;
                border-top: var(--border);

                @media only screen and (min-width: ${breakpoints.MD}) {
                    position: absolute;
                    bottom: 0;
                    height: 4.5rem;
                    width: 100%;
                }

                .MuiTableRow-footer {
                    display: flex;
                    align-items: center;

                    .MuiTablePagination-root {
                        border-bottom: none;

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
    }
`;
