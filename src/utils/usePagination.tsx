import { Box, IconButton, TablePagination } from '@material-ui/core';
import {
    FirstPageOutlined,
    KeyboardArrowLeftOutlined,
    KeyboardArrowRightOutlined,
    LastPageOutlined,
} from '@material-ui/icons';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import React, { ChangeEvent, MouseEvent } from 'react';

import { Router, useTranslation } from '../i18n';

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onChangePage: (e: MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

const TablePaginationActions = ({
    count,
    page,
    rowsPerPage,
    onChangePage,
}: TablePaginationActionsProps): JSX.Element => {
    const handleFirstPageButtonClick = (e: MouseEvent<HTMLButtonElement>): void => onChangePage(e, 0);
    const handleBackButtonClick = (e: MouseEvent<HTMLButtonElement>): void => onChangePage(e, page - 1);
    const handleNextButtonClick = (e: MouseEvent<HTMLButtonElement>): void => onChangePage(e, page + 1);

    const handleLastPageButtonClick = (e: MouseEvent<HTMLButtonElement>): void => {
        onChangePage(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box display="flex" margin="0.5rem">
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} size="small">
                <FirstPageOutlined />
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} size="small">
                <KeyboardArrowLeftOutlined />
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                size="small"
            >
                <KeyboardArrowRightOutlined />
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                size="small"
            >
                <LastPageOutlined />
            </IconButton>
        </Box>
    );
};

interface UsePagination {
    renderMobileTablePagination: JSX.Element;
    renderDesktopTablePagination: JSX.Element;
    getPaginationQuery: (values: {}) => ParsedUrlQueryInput;
}

export const usePagination = (count: number, filterValues: {}): UsePagination => {
    const { query, pathname } = useRouter();
    const { t } = useTranslation();
    const page = Number(R.propOr(1, 'page', query));
    const rowsPerPage = Number(R.propOr(10, 'pageSize', query));
    const rowsPerPageOptions = [5, 10, 25, 50, 100];

    const getPaginationQuery = (values: {}): ParsedUrlQueryInput => {
        return R.pickBy(
            (val: string, key: string): boolean =>
                (!!val && key === 'page') || key === 'pageSize' || key in filterValues,
            values,
        );
    };

    const handleReloadPage = (values: {}): void => {
        const query = getPaginationQuery(values);
        Router.push({ pathname, query });
    };

    const handleChangePage = (_e: MouseEvent<HTMLButtonElement> | null, page: number): void => {
        handleReloadPage({ ...query, page: page + 1 }); // Back end indexing starts from 1.
    };

    const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const pageSize = parseInt(e.target.value, 10);
        handleReloadPage({ ...query, pageSize });
    };

    const renderTablePagination = (classes: string): JSX.Element => (
        <TablePagination
            className={classes}
            rowsPerPageOptions={rowsPerPageOptions}
            colSpan={3}
            count={count}
            rowsPerPage={rowsPerPage}
            page={page - 1}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            labelRowsPerPage={t('common:resultsPerPage')}
            ActionsComponent={TablePaginationActions}
            SelectProps={{ native: true }}
        />
    );

    const renderMobileTablePagination = renderTablePagination('md-down');
    const renderDesktopTablePagination = renderTablePagination('md-up');
    return { renderMobileTablePagination, renderDesktopTablePagination, getPaginationQuery };
};
