import { LabelDisplayedRowsArgs, makeStyles, TableFooter, TablePagination, TableRow } from '@material-ui/core';
import { useTranslation } from 'lib';
import React from 'react';
import { CustomTablePaginationProps } from 'types';
import { RESULTS_PER_PAGE_OPTIONS } from 'utils';

import { CustomTablePaginationActions } from './CustomTablePaginationActions';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
    toolbar: {
        padding: spacing(4),
        display: 'flex',
        justifyContent: 'center',
        [breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
    spacer: {
        flex: 0,
    },
    dense: {
        marginTop: 0,
    },
}));

const commonTablePaginationProps = {
    rowsPerPageOptions: RESULTS_PER_PAGE_OPTIONS,
    colSpan: 3,
    ActionsComponent: CustomTablePaginationActions,
    SelectProps: {
        native: true,
        fullWidth: false,
    },
};

export const CustomTableFooter: React.FC<CustomTablePaginationProps> = ({ dense, ...tablePaginationProps }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const labelDisplayedRows = ({ from, to, count }: LabelDisplayedRowsArgs): string => `${from} - ${to} / ${count}`;

    return (
        <TableFooter className={dense ? classes.dense : ''}>
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
