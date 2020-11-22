import { LoadingTemplate, OfflineTemplate } from 'components';
import { useUserMe } from 'hooks';
import { NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { GET_STARTED_PAGE_VISITED_KEY, urls } from 'utils';

// Fetch user from API and set context with the value.
// If user has not visited get started page, redirect there.
// Wrap all pages that do not require authentication with this.
export const withUserMe = <T extends Record<symbol, unknown>>(
  PageComponent: NextPage<T>,
): NextPage => {
  const WithUserMe: NextPage = (pageProps) => {
    const { authLoading, authNetworkError } = useUserMe();
    const { asPath } = useRouter();

    useEffect(() => {
      const getStartedPageVisited = !!localStorage.getItem(GET_STARTED_PAGE_VISITED_KEY);

      !getStartedPageVisited &&
        Router.push({
          pathname: urls.getStarted,
          query: { next: asPath },
        });
    }, []);

    if (authNetworkError) {
      return <OfflineTemplate />;
    }

    if (!authLoading && !authNetworkError) {
      return <PageComponent {...(pageProps as T)} />;
    }

    return <LoadingTemplate />;
  };

  return WithUserMe;
};
