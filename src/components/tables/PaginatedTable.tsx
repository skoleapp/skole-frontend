import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import Router, { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { ChangeEvent, MouseEvent } from 'react';
import { CustomTableHeadProps } from 'types';
import { getQueryWithPagination, RESULTS_PER_PAGE_OPTIONS } from 'utils';

import { CustomTableFooter } from './CustomTableFooter';
import { CustomTableHead } from './CustomTableHead';

interface Props {
  tableHeadProps?: CustomTableHeadProps;
  count: number;
  extraFilters?: Record<symbol, unknown>; // Additional query parameters to the pagination params.
  renderTableBody: JSX.Element;
}

export const PaginatedTable: React.FC<Props> = ({
  count,
  tableHeadProps,
  extraFilters = {},
  renderTableBody,
}) => {
  const { query, pathname } = useRouter();
  const page = Number(R.propOr(1, 'page', query));
  const rowsPerPage = Number(R.propOr(RESULTS_PER_PAGE_OPTIONS[0], 'pageSize', query));

  const handleReloadPage = (values: Record<symbol, unknown>): void => {
    const query = getQueryWithPagination({ query: values, extraFilters });
    Router.push({ pathname, query });
  };

  const handleChangePage = async (
    _e: MouseEvent<HTMLButtonElement> | null,
    page: number,
  ): Promise<void> => {
    handleReloadPage({ ...query, page: page + 1 }); // Backend indexing starts from 1.
  };

  const handleChangeRowsPerPage = async (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): Promise<void> => {
    const pageSize = parseInt(e.target.value);
    handleReloadPage({ ...query, pageSize });
  };

  const renderTableHead = !!tableHeadProps && <CustomTableHead {...tableHeadProps} />;

  const renderTableFooter = (
    <CustomTableFooter
      count={count}
      page={page - 1}
      rowsPerPage={rowsPerPage}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );

  return (
    <TableContainer>
      <Table>
        {renderTableHead}
        {renderTableBody}
        {renderTableFooter}
      </Table>
    </TableContainer>
  );
};
