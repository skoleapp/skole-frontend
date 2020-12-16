import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import * as url from 'url';
import { MutationFormError } from 'types';

// A utility that we use to display all media from our backend.
export const mediaUrl = (filePath: string): string => {
  return !filePath
    ? ''
    : filePath.includes('//')
    ? filePath
    : url.resolve(process.env.API_URL || '', filePath);
};

interface QueryWithPaginationProps {
  query: Record<symbol, unknown>;
  extraFilters: Record<symbol, unknown>;
}

// Get query parameters with pagination included.
export const getQueryWithPagination = ({
  query,
  extraFilters,
}: QueryWithPaginationProps): ParsedUrlQueryInput =>
  R.pick(['page', 'pageSize', ...Object.keys(extraFilters)], query);

// Get pagination params and drop all other params.
export const getPaginationQuery = (query: ParsedUrlQueryInput): ParsedUrlQueryInput =>
  R.pick(['page', 'pageSize'], query);

// Truncate strings to a given length.
export const truncate = (str: string, num: number): string => {
  if (str.length > num) {
    return `${str.slice(0, num)}...`;
  }

  return str;
};

export const formatFormError = (error: MutationFormError): string => error.messages.join('\n');
