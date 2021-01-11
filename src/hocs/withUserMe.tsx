import { LoadingTemplate, OfflineTemplate } from 'components';
import { useUserMe } from 'hooks';
import { NextPage } from 'next';
import Router from 'next/router';
import React, { useEffect } from 'react';
import { LS_LOGOUT_KEY, urls } from 'utils';
import { withCommonContexts } from './withCommonContexts';

// Fetch user from API and set context with the value.
export const withUserMe = (PageComponent: NextPage): NextPage => {
  const WithUserMe: NextPage = (pageProps) => {
    const { authLoading, authNetworkError } = useUserMe();

    const syncLogout = (e: StorageEvent): false | Promise<boolean> =>
      e.key === LS_LOGOUT_KEY && Router.push(urls.logout);

    useEffect(() => {
      window.addEventListener('storage', syncLogout);

      return (): void => {
        window.removeEventListener('storage', syncLogout);
        localStorage.removeItem(LS_LOGOUT_KEY);
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
