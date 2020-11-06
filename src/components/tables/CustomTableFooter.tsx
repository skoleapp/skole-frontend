import { LabelDisplayedRowsArgs, makeStyles, TableFooter, TablePagination, TableRow } from '@material-ui/core';
import { useTranslation } from 'lib';
import React from 'react';
import { CustomTablePaginationProps } from 'types';
import { RESULTS_PER_PAGE_OPTIONS } from 'utils';

import { CustomTablePaginationActions } from './CustomTablePaginationActions';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
    toolbar: {
        padding: spacing(2),
        display: 'flex',
        justifyContent: 'center',
        [breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
    spacer: {
        flex: 0,
    },
}));

const commonTablePaginationProps = {
    rowsPerPageOptions: RESULTS_PER_PAGE_OPTIONS,
    colSpan: 3,
    SelectProps: {
        native: true,
        fullWidth: false,
    },
    ActionsComponent: CustomTablePaginationActions,
};

export const CustomTableFooter: React.FC<CustomTablePaginationProps> = tablePaginationProps => {
    const { t } = useTranslation();
    const classes = useStyles();
    const labelDisplayedRows = ({ from, to, count }: LabelDisplayedRowsArgs): string => `${from} - ${to} / ${count}`;

    return (
        <TableFooter>
            <TableRow>
                <TablePagination
                    classes={{ toolbar: classes.toolbar, spacer: classes.spacer }}
                    labelRowsPerPage={t('common:resultsPerPage')}
                    labelDisplayedRows={labelDisplayedRows}
                    {...commonTablePaginationProps}
                    {...tablePaginationProps}
                />
            </TableRow>
        </TableFooter>
    );
};
