import { Router } from 'lib';
import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import * as url from 'url';
import { UrlObject } from 'url';

export const mediaURL = (filePath: string): string => {
    return !filePath ? '' : filePath.includes('//') ? filePath : url.resolve(process.env.API_URL || '', filePath);
};

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

// Utility that we use for all client-side redirects.
// We must explicitly use Router object provided by i18n client.
// Using this utility prevents us to mistakenly import the wrong Router object.
export const redirect = (location: string | UrlObject): Promise<boolean> => Router.push(location);

export const truncate = (str: string, num: number): string => {
    if (str.length > num) {
        return str.slice(0, num) + '...';
    } else {
        return str;
    }
};
