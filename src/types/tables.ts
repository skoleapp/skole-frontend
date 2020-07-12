import { TablePaginationProps } from '@material-ui/core';

export type CustomTablePaginationProps = Pick<
    TablePaginationProps,
    'page' | 'count' | 'rowsPerPage' | 'onChangePage' | 'onChangeRowsPerPage'
>;

export interface CustomTableHeadProps {
    titleLeft?: string;
    titleLeftDesktop?: string;
    titleRight?: string;
}

export interface CommonPaginatedTableProps {
    tableHeadProps: CustomTableHeadProps;
    renderTableBody: JSX.Element;
}
