import { LoadingLayout, OfflineLayout } from 'components';
import { useUserMe } from 'hooks';
import { NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { urls } from 'utils';

// Disable access for authenticated users.
// Wrap all pages that require access only for unauthenticated users with this for all pages.
export const withNoAuth = <T extends Record<symbol, unknown>>(
  PageComponent: NextPage<T>
): NextPage => {
  const WithNoAuth: NextPage = (pageProps) => {
    const { userMe, authLoading, authNetworkError } = useUserMe();
    const shouldRedirect = !(authLoading || authNetworkError || !userMe);
    const { asPath } = useRouter();

    // Automatically redirect user to logout if he is authenticated.
    useEffect(() => {
      shouldRedirect &&
        Router.replace({
          pathname: urls.confirmLogout,
          query: { next: asPath },
        });
    }, [shouldRedirect]);

    if (authNetworkError) {
      return <OfflineLayout />;
    }

    if (!userMe && !authLoading) {
      return <PageComponent {...(pageProps as T)} />;
    }

    return <LoadingLayout />;
  };

  return WithNoAuth;
};
