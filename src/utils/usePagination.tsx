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
import React, { ChangeEvent, MouseEvent, useState } from 'react';

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

const commonTablePaginationProps = {
    rowsPerPageOptions: [5, 10, 25, 50, 100],
    colSpan: 3,
    SelectProps: { native: true },
    ActionsComponent: TablePaginationActions,
};

interface UsePagination {
    renderTablePagination: JSX.Element;
    getPaginationQuery: (values: {}) => ParsedUrlQueryInput;
}

export const usePagination = (count: number, filterValues: {}): UsePagination => {
    const { query, pathname } = useRouter();
    const { t } = useTranslation();
    const page = Number(R.propOr(1, 'page', query));
    const rowsPerPage = Number(R.propOr(10, 'pageSize', query));

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

    const renderTablePagination = (
        <TablePagination
            {...commonTablePaginationProps}
            count={count}
            rowsPerPage={rowsPerPage}
            page={page - 1}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            labelRowsPerPage={t('common:resultsPerPage')}
        />
    );

    return { renderTablePagination, getPaginationQuery };
};

interface UseFrontendPagination<T> {
    renderTablePagination: JSX.Element;
    paginatedItems: T[];
}

export const useFrontendPagination = <T extends {}>(items: T[]): UseFrontendPagination<T> => {
    const { t } = useTranslation();
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const paginatedItems = items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const handleChangePage = (_e: MouseEvent<HTMLButtonElement> | null, page: number): void => setPage(page);

    const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setRowsPerPage(parseInt(e.target.value, 10));
    };

    const renderTablePagination = (
        <TablePagination
            {...commonTablePaginationProps}
            count={items.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            labelRowsPerPage={t('common:resultsPerPage')}
        />
    );

    return { renderTablePagination, paginatedItems };
};
