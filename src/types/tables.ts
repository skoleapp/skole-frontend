import { TablePaginationProps } from '@material-ui/core';

type T = Pick<TablePaginationProps, 'page' | 'count' | 'rowsPerPage' | 'onChangePage' | 'onChangeRowsPerPage'>;

export interface CustomTablePaginationProps extends T {
    dense?: boolean; // Boolean attribute wether to push the footer to the bottom of the table.
}

export interface CustomTableHeadProps {
    titleLeft?: string;
    titleLeftDesktop?: string;
    titleRight?: string;
}
