import { LoadingTemplate, OfflineTemplate } from 'components';
import { useUserMe } from 'hooks';
import { NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { GET_STARTED_PAGE_VISITED_KEY, urls } from 'utils';
import { withCommonContexts } from './withCommonContexts';

// Prevent access for unauthenticated users.
// Redirect new users to landing page and existing unauthenticated users to login page.
// Redirect to logout page if multiple browser windows are open and user logs out.
// Wrap all pages that require authentication with this.
export const withAuth = (PageComponent: NextPage): NextPage => {
  const WithAuth: NextPage = (pageProps) => {
    const { userMe, authLoading, authNetworkError } = useUserMe();
    const shouldRedirect = !(authLoading || authNetworkError || !!userMe);
    const { asPath } = useRouter();

    const syncLogout = (e: StorageEvent): false | Promise<boolean> =>
      e.key === 'logout' && Router.push(urls.logout);

    useEffect(() => {
      if (shouldRedirect) {
        const query = asPath !== urls.home ? { next: asPath } : {};
        const existingUser = localStorage.getItem('user');
        const getStartedPageVisited = !!localStorage.getItem(GET_STARTED_PAGE_VISITED_KEY);

        if (!!existingUser || getStartedPageVisited) {
          Router.replace({ pathname: urls.confirmLogin, query });
        } else {
          Router.push({ pathname: urls.getStarted, query });
        }
      }
    }, [shouldRedirect]);

    useEffect(() => {
      window.addEventListener('storage', syncLogout);

      return (): void => {
        window.removeEventListener('storage', syncLogout);
        localStorage.removeItem('logout');
      };
    }, []);

    if (authNetworkError) {
      return <OfflineTemplate />;
    }

    if (userMe) {
      return <PageComponent {...pageProps} />;
    }

    return <LoadingTemplate />;
  };

  return withCommonContexts(WithAuth);
};
