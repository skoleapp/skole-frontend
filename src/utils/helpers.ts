import { OperationVariables } from '@apollo/client';
import { ImageLoader } from 'next/image';
import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';

export const mediaUrl = (filePath: string): string => `${process.env.API_URL}${filePath}`;

export const mediaLoader: ImageLoader = ({ src, width, quality }) =>
  `${process.env.API_URL}${src}?w=${width}&q=${quality || 75}`;

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

export const getLanguageHeaderContext = (locale?: string): OperationVariables => ({
  headers: {
    'Accept-Language': locale,
  },
});
