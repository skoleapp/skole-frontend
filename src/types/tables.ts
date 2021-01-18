import { TablePaginationProps } from '@material-ui/core/TablePagination';

export type CustomTablePaginationProps = Pick<
  TablePaginationProps,
  'page' | 'count' | 'rowsPerPage' | 'onChangePage' | 'onChangeRowsPerPage'
>;
