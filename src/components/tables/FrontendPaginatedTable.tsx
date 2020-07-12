import { Table, TableContainer, TablePaginationProps } from '@material-ui/core';
import React from 'react';
import { CommonPaginatedTableProps } from 'types';

import { StyledTable } from '..';
import { CustomTableFooter, CustomTableHead } from '.';

interface Props extends CommonPaginatedTableProps {
    paginationProps: TablePaginationProps;
}

export const FrontendPaginatedTable: React.FC<Props> = ({ tableHeadProps, renderTableBody, paginationProps }) => {
    const renderTableHead = <CustomTableHead {...tableHeadProps} />;
    const renderTableFooter = <CustomTableFooter {...paginationProps} />;

    return (
        <StyledTable>
            <TableContainer>
                <Table>
                    {renderTableHead}
                    {renderTableBody}
                    {renderTableFooter}
                </Table>
            </TableContainer>
        </StyledTable>
    );
};
