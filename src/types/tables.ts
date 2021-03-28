import { GridSize } from '@material-ui/core/Grid';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'; // eslint-disable-line no-restricted-imports
import { TablePaginationProps } from '@material-ui/core/TablePagination';

export type CustomTablePaginationProps = Pick<
  TablePaginationProps,
  'page' | 'count' | 'rowsPerPage' | 'onChangePage' | 'onChangeRowsPerPage'
>;

export type ColSpan = Partial<Record<Breakpoint, GridSize>>;
