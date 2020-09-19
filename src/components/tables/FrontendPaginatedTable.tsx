import { Table, TableContainer, TablePaginationProps } from '@material-ui/core';
import React from 'react';
import { CommonPaginatedTableProps } from 'types';

import { CustomTableFooter } from './CustomTableFooter';
import { CustomTableHead } from './CustomTableHead';

interface Props extends CommonPaginatedTableProps {
    paginationProps: TablePaginationProps;
}

export const FrontendPaginatedTable: React.FC<Props> = ({ tableHeadProps, renderTableBody, paginationProps }) => {
    const renderTableHead = <CustomTableHead {...tableHeadProps} />;
    const renderTableFooter = <CustomTableFooter {...paginationProps} />;

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
