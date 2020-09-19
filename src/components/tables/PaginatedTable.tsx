import { Table, TableContainer } from '@material-ui/core';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { ChangeEvent, MouseEvent } from 'react';
import { CommonPaginatedTableProps } from 'types';
import { getQueryWithPagination, redirect } from 'utils';

import { CustomTableFooter } from './CustomTableFooter';
import { CustomTableHead } from './CustomTableHead';

interface Props extends CommonPaginatedTableProps {
    count: number;
    extraFilters?: {};
}

export const PaginatedTable: React.FC<Props> = ({ count, tableHeadProps, extraFilters = {}, renderTableBody }) => {
    const { query, pathname } = useRouter();
    const page = Number(R.propOr(1, 'page', query));
    const rowsPerPage = Number(R.propOr(10, 'pageSize', query));

    const handleReloadPage = (values: {}): void => {
        const query = getQueryWithPagination({ query: values, extraFilters });
        redirect({ pathname, query });
    };

    const handleChangePage = (_e: MouseEvent<HTMLButtonElement> | null, page: number): void => {
        handleReloadPage({ ...query, page: page + 1 }); // Backend indexing starts from 1.
    };

    const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const pageSize = parseInt(e.target.value, 10);
        handleReloadPage({ ...query, pageSize });
    };

    const renderTableHead = <CustomTableHead {...tableHeadProps} />;

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
        <Table>
            <TableContainer>
                {renderTableHead}
                {renderTableBody}
                {renderTableFooter}
            </TableContainer>
        </Table>
    );
};
