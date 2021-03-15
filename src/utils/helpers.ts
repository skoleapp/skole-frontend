import { OperationVariables } from '@apollo/client';
import { ImageLoader } from 'next/image';
import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';

// A utility that we use to display all media from our backend.
// In the dev env `filePath` will be relative URL e.g. `/media/uploads/foo.jpeg`,
// in the prod env it will instead be a absolute URL: `https://s3-media.com/foo.jepg`.
export const mediaUrl = (filePath: string): string =>
  process.env.API_URL ? new URL(filePath, process.env.API_URL).href : filePath;

export const mediaLoader: ImageLoader = ({ src }) => mediaUrl(src);

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
// If string contains line breaks, return only first line.
export const truncate = (str: string, num: number): string => {
  if (str.length > num) {
    return `${str.slice(0, num)}...`;
  }

  if (str.split('\n').length > 1) {
    return `${str.split('\n')[0]}...`;
  }

  return str;
};

export const getLanguageHeaderContext = (locale?: string): OperationVariables => ({
  headers: {
    'Accept-Language': locale,
  },
});

export const isNotNativeApp =
  typeof window !== 'undefined' && navigator.userAgent !== 'skole-native-app';

export const postMessageWebView = (data: string): void =>
  window.ReactNativeWebView?.postMessage(data);
