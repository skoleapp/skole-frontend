import {
    Box,
    IconButton,
    Table,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TablePaginationProps,
    TableRow,
    Typography,
} from '@material-ui/core';
import {
    FirstPageOutlined,
    KeyboardArrowLeftOutlined,
    KeyboardArrowRightOutlined,
    LastPageOutlined,
} from '@material-ui/icons';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { ChangeEvent, MouseEvent } from 'react';
import { useDeviceContext } from 'src/context';

import { Router, useTranslation } from '../../i18n';
import { CustomTablePaginationProps, TextColor, TextVariant } from '../../types';
import { getPaginationQuery } from '../../utils';
import { StyledTable } from './StyledTable';
import { StyledTooltip } from './StyledTooltip';

interface CustomTableHeadProps {
    titleLeft?: string;
    titleLeftDesktop?: string;
    titleRight?: string;
}

const titleProps = {
    variant: 'subtitle1' as TextVariant,
    color: 'textSecondary' as TextColor,
};

const CustomTableHead = ({
    titleLeft,
    titleLeftDesktop = titleLeft,
    titleRight,
}: CustomTableHeadProps): JSX.Element => {
    const isMobile = useDeviceContext();

    return (
        <TableHead>
            <TableRow>
                <TableCell>
                    {isMobile && <Typography {...titleProps}>{titleLeft}</Typography>}
                    {!isMobile && <Typography {...titleProps}>{titleLeftDesktop}</Typography>}
                </TableCell>
                <TableCell align="right">
                    <Typography {...titleProps}>{titleRight}</Typography>
                </TableCell>
            </TableRow>
        </TableHead>
    );
};

interface CustomTablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onChangePage: (e: MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

const CustomTablePaginationActions = ({
    count,
    page,
    rowsPerPage,
    onChangePage,
}: CustomTablePaginationActionsProps): JSX.Element => {
    const { t } = useTranslation();
    const handleFirstPageButtonClick = (e: MouseEvent<HTMLButtonElement>): void => onChangePage(e, 0);
    const handleBackButtonClick = (e: MouseEvent<HTMLButtonElement>): void => onChangePage(e, page - 1);
    const handleNextButtonClick = (e: MouseEvent<HTMLButtonElement>): void => onChangePage(e, page + 1);

    const handleLastPageButtonClick = (e: MouseEvent<HTMLButtonElement>): void => {
        onChangePage(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box display="flex" margin="0.5rem">
            <StyledTooltip title={t('common:firstPageTooltip')}>
                <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} size="small">
                    <FirstPageOutlined />
                </IconButton>
            </StyledTooltip>
            <StyledTooltip title={t('common:previousPageTooltip')}>
                <IconButton onClick={handleBackButtonClick} disabled={page === 0} size="small">
                    <KeyboardArrowLeftOutlined />
                </IconButton>
            </StyledTooltip>
            <StyledTooltip title={t('common:nextPageTooltip')}>
                <IconButton
                    onClick={handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    size="small"
                >
                    <KeyboardArrowRightOutlined />
                </IconButton>
            </StyledTooltip>
            <StyledTooltip title={t('common:lastPageTooltip')}>
                <IconButton
                    onClick={handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    size="small"
                >
                    <LastPageOutlined />
                </IconButton>
            </StyledTooltip>
        </Box>
    );
};

const commonTablePaginationProps = {
    rowsPerPageOptions: [5, 10, 25, 50, 100],
    colSpan: 3,
    SelectProps: { native: true },
    ActionsComponent: CustomTablePaginationActions,
};

const CustomTableFooter = (tablePaginationProps: CustomTablePaginationProps): JSX.Element => {
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

interface CommonPaginatedTableProps {
    tableHeadProps: CustomTableHeadProps;
    renderTableBody: JSX.Element;
}

interface PaginatedTableProps extends CommonPaginatedTableProps {
    count: number;
    extraFilters?: {};
}

export const PaginatedTable: React.FC<PaginatedTableProps> = ({
    count,
    tableHeadProps,
    extraFilters = {},
    renderTableBody,
}) => {
    const { query, pathname } = useRouter();
    const page = Number(R.propOr(1, 'page', query));
    const rowsPerPage = Number(R.propOr(10, 'pageSize', query));

    const handleReloadPage = (values: {}): void => {
        const query = getPaginationQuery({ query: values, extraFilters });
        Router.push({ pathname, query });
    };

    const handleChangePage = (_e: MouseEvent<HTMLButtonElement> | null, page: number): void => {
        handleReloadPage({ ...query, page: page + 1 }); // Backend indexing starts from 1.
    };

    const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const pageSize = parseInt(e.target.value, 10);
        handleReloadPage({ ...query, pageSize });
    };

    return (
        <StyledTable>
            <TableContainer>
                <Table>
                    <CustomTableHead {...tableHeadProps} />
                    {renderTableBody}
                    <CustomTableFooter
                        count={count}
                        page={page - 1}
                        rowsPerPage={rowsPerPage}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Table>
            </TableContainer>
        </StyledTable>
    );
};

interface FrontendPaginatedTableProps extends CommonPaginatedTableProps {
    paginationProps: TablePaginationProps;
}

export const FrontendPaginatedTable: React.FC<FrontendPaginatedTableProps> = ({
    tableHeadProps,
    renderTableBody,
    paginationProps,
}) => (
    <StyledTable>
        <TableContainer>
            <Table>
                <CustomTableHead {...tableHeadProps} />
                {renderTableBody}
                <CustomTableFooter {...paginationProps} />
            </Table>
        </TableContainer>
    </StyledTable>
);
