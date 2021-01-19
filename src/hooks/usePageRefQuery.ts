import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { PageRef } from 'types';

// Validate and return current page ref query for re-use. Drop out all invalid page refs.
export const usePageRefQuery = (pageRef?: PageRef | null): ParsedUrlQuery => {
  const { query } = useRouter();
  const ref = pageRef || String(query.ref);

  const pageRefQuery = Object.values<string>(PageRef).includes(ref) && {
    ref,
  };

  return pageRefQuery || {};
};
