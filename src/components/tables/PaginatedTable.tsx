import { Table, TableContainer } from '@material-ui/core';
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
    extraFilters?: {}; // Additional query parameters to the pagination params.
    renderTableBody: JSX.Element;
}

export const PaginatedTable: React.FC<Props> = ({ count, tableHeadProps, extraFilters = {}, renderTableBody }) => {
    const { query, pathname } = useRouter();
    const page = Number(R.propOr(1, 'page', query));
    const rowsPerPage = Number(R.propOr(RESULTS_PER_PAGE_OPTIONS[0], 'pageSize', query));

    const handleReloadPage = async (values: {}): Promise<void> => {
        const query = getQueryWithPagination({ query: values, extraFilters });
        await Router.push({ pathname, query });
    };

    const handleChangePage = async (_e: MouseEvent<HTMLButtonElement> | null, page: number): Promise<void> => {
        await handleReloadPage({ ...query, page: page + 1 }); // Backend indexing starts from 1.
    };

    const handleChangeRowsPerPage = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): Promise<void> => {
        const pageSize = parseInt(e.target.value);
        await handleReloadPage({ ...query, pageSize });
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
