import { Router } from 'lib';
import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import * as url from 'url';
import { UrlObject } from 'url';

// A utility that we use to display all media from our backend.
export const mediaURL = (filePath: string): string => {
    return !filePath ? '' : filePath.includes('//') ? filePath : url.resolve(process.env.API_URL || '', filePath);
};

interface QueryWithPaginationProps {
    query: {};
    extraFilters: {};
}

// A utility that we use to get query parameters *with* pagination included.
// So Use this when you need to update the query params and retain the pagination query.
export const getQueryWithPagination = ({ query, extraFilters }: QueryWithPaginationProps): ParsedUrlQueryInput =>
    R.pickBy(
        (val: string, key: string): boolean => (!!val && key === 'page') || key === 'pageSize' || key in extraFilters,
        query,
    );

// A utility that we use to get *only* the pagination query.
// This will lose all other query params so only use this when you want to reset all other query params except the pagination ones.
export const getPaginationQuery = (query: ParsedUrlQueryInput): ParsedUrlQueryInput =>
    R.pickBy((val: string, key: string): boolean => (!!val && key === 'page') || key === 'pageSize', query);

// Utility that we use for all client-side redirects.
// We must explicitly use Router object provided by i18n client.
// Using this utility prevents us to mistakenly import the wrong Router object.
export const redirect = (location: string | UrlObject): Promise<boolean> => Router.push(location);

// A utility that we use to truncate strings to a given length.
export const truncate = (str: string, num: number): string => {
    if (str.length > num) {
        return str.slice(0, num) + '...';
    } else {
        return str;
    }
};
