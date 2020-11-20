import { LoadingLayout, OfflineLayout } from 'components';
import { useUserMe } from 'hooks';
import { NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { GET_STARTED_PAGE_VISITED_KEY, urls } from 'utils';

// Sync authentication between pages.
// Wrap all pages that require authentication with this.
export const withAuth = <T extends Record<symbol, unknown>>(
  PageComponent: NextPage<T>,
): NextPage => {
  const withAuth: NextPage = (pageProps) => {
    const { userMe, authLoading, authNetworkError } = useUserMe();
    const shouldRedirect = !(authLoading || authNetworkError || !!userMe);
    const { asPath } = useRouter();

    const syncLogout = async (e: StorageEvent): Promise<void> => {
      if (e.key === 'logout') {
        await Router.push(urls.logout);
      }
    };

    // Automatically redirect user to get started/login page if not authenticated.
    useEffect(() => {
      if (shouldRedirect) {
        const query = asPath !== urls.home ? { next: asPath } : {};
        const existingUser = localStorage.getItem('user');

        const getStartedPageVisited = !!localStorage.getItem(
          GET_STARTED_PAGE_VISITED_KEY,
        );

        // Only redirect new users to get started page (users who have already logged in at some point).
        // Redirect old users and users who have visited get started page to login page.
        if (!!existingUser || getStartedPageVisited) {
          Router.replace({ pathname: urls.confirmLogin, query });
        } else {
          Router.push({ pathname: urls.getStarted, query });
        }
      }
    }, [shouldRedirect]);

    // Automatically redirect to login if multiple browser windows are open and user logs out.
    useEffect(() => {
      window.addEventListener('storage', syncLogout);

      return (): void => {
        window.removeEventListener('storage', syncLogout);
        localStorage.removeItem('logout');
      };
    }, []);

    if (authNetworkError) {
      return <OfflineLayout />;
    }

    if (userMe) {
      return <PageComponent {...(pageProps as T)} />;
    }

    return <LoadingLayout />;
  };

  return withAuth;
};
