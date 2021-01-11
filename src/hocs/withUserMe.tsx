import { LoadingTemplate, OfflineTemplate } from 'components';
import { useUserMe } from 'hooks';
import { NextPage } from 'next';
import Router from 'next/router';
import React, { useEffect } from 'react';
import { urls } from 'utils';
import { withCommonContexts } from './withCommonContexts';

// Fetch user from API and set context with the value.
export const withUserMe = (PageComponent: NextPage): NextPage => {
  const WithUserMe: NextPage = (pageProps) => {
    const { authLoading, authNetworkError } = useUserMe();

    const syncLogout = (e: StorageEvent): false | Promise<boolean> =>
      e.key === 'logout' && Router.push(urls.logout);

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

    if (!authLoading && !authNetworkError) {
      return <PageComponent {...pageProps} />;
    }

    return <LoadingTemplate />;
  };

  return withCommonContexts(WithUserMe);
};
