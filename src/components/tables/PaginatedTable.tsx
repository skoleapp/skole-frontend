import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import Router, { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { ChangeEvent, MouseEvent, useCallback, useMemo } from 'react';
import { getQueryWithPagination, RESULTS_PER_PAGE_OPTIONS } from 'utils';

import { CustomTableFooter } from './CustomTableFooter';

interface Props {
  page: number;
  count: number;
  extraFilters?: Record<symbol, unknown>; // Additional query parameters to the pagination params - these are kept in the URL when changing pages etc.
  renderTableBody: JSX.Element;
}

export const PaginatedTable: React.FC<Props> = ({
  page,
  count,
  extraFilters = {},
  renderTableBody,
}) => {
  const { query, pathname } = useRouter();
  const rowsPerPage = Number(R.propOr(RESULTS_PER_PAGE_OPTIONS[0], 'pageSize', query));

  const handleReloadPage = useCallback(
    (values: Record<symbol, unknown>): void => {
      const query = getQueryWithPagination({ query: values, extraFilters });
      Router.push({ pathname, query }, undefined, { shallow: true });
    },
    [extraFilters, pathname],
  );

  const handleChangePage = useCallback(
    async (_e: MouseEvent<HTMLButtonElement> | null, page: number): Promise<void> => {
      handleReloadPage({ ...query, page: page + 1 }); // Backend indexing starts from 1.
    },
    [handleReloadPage, query],
  );

  const handleChangeRowsPerPage = useCallback(
    async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): Promise<void> => {
      const pageSize = parseInt(e.target.value, 10);
      handleReloadPage({ ...query, pageSize });
    },
    [handleReloadPage, query],
  );

  const renderTableFooter = useMemo(
    () => (
      <CustomTableFooter
        count={count}
        page={page - 1}
        rowsPerPage={rowsPerPage}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    ),
    [count, handleChangePage, handleChangeRowsPerPage, page, rowsPerPage],
  );

  return (
    <TableContainer>
      <Table>
        {renderTableBody}
        {renderTableFooter}
      </Table>
    </TableContainer>
  );
};
