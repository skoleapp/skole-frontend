import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import { ChangeEvent, MouseEvent, useState } from 'react';
import { CustomTablePaginationProps } from 'src/types';

interface Props {
    query: {};
    extraFilters: {};
}

export const getPaginationQuery = ({ query, extraFilters }: Props): ParsedUrlQueryInput => {
    return R.pickBy(
        (val: string, key: string): boolean => (!!val && key === 'page') || key === 'pageSize' || key in extraFilters,
        query,
    );
};

interface UseFrontendPagination<T> extends CustomTablePaginationProps {
    paginatedItems: T[];
}

export const useFrontendPagination = <T extends {}>(items: T[]): UseFrontendPagination<T> => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const paginatedItems = items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const count = paginatedItems.length;
    const onChangePage = (_e: MouseEvent<HTMLButtonElement> | null, page: number): void => setPage(page);

    const onChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setRowsPerPage(parseInt(e.target.value, 10));
    };

    return { paginatedItems, page, rowsPerPage, count, onChangePage, onChangeRowsPerPage };
};
