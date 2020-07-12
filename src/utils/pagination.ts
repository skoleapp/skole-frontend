import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';

interface Props {
    query: {};
    extraFilters: {};
}

export const getQueryWithPagination = ({ query, extraFilters }: Props): ParsedUrlQueryInput =>
    R.pickBy(
        (val: string, key: string): boolean => (!!val && key === 'page') || key === 'pageSize' || key in extraFilters,
        query,
    );

export const getPaginationQuery = (query: ParsedUrlQueryInput): ParsedUrlQueryInput =>
    R.pickBy((val: string, key: string): boolean => (!!val && key === 'page') || key === 'pageSize', query);
