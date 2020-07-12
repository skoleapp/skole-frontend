import { TableFooter, TablePagination, TableRow } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CustomTablePaginationProps } from 'types';

import { CustomTablePaginationActions } from './CustomTablePaginationActions';

const commonTablePaginationProps = {
    rowsPerPageOptions: [5, 10, 25, 50, 100],
    colSpan: 3,
    SelectProps: { native: true },
    ActionsComponent: CustomTablePaginationActions,
};

export const CustomTableFooter: React.FC<CustomTablePaginationProps> = tablePaginationProps => {
    const { t } = useTranslation();

    return (
        <TableFooter>
            <TableRow>
                <TablePagination
                    labelRowsPerPage={t('common:resultsPerPage')}
                    {...commonTablePaginationProps}
                    {...tablePaginationProps}
                />
            </TableRow>
        </TableFooter>
    );
};
