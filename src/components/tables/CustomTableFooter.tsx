import { makeStyles, TableFooter, TablePagination, TableRow } from '@material-ui/core';
import { useTranslation } from 'lib';
import React from 'react';
import { CustomTablePaginationProps } from 'types';

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
    rowsPerPageOptions: [5, 10, 25, 50, 100],
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

    return (
        <TableFooter>
            <TableRow>
                <TablePagination
                    classes={{ toolbar: classes.toolbar, spacer: classes.spacer }}
                    labelRowsPerPage={t('common:resultsPerPage')}
                    {...commonTablePaginationProps}
                    {...tablePaginationProps}
                />
            </TableRow>
        </TableFooter>
    );
};
