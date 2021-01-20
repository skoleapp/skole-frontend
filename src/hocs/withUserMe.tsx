import { ErrorTemplate, LoadingTemplate } from 'components';
import { useUserMe } from 'hooks';
import { NextPage } from 'next';
import Router from 'next/router';
import React, { useEffect } from 'react';
import { SeoPageProps } from 'types';
import { LS_LOGOUT_KEY, urls } from 'utils';

import { withCommonContexts } from './withCommonContexts';

// Fetch user from API and set context with the value.
export const withUserMe = <T extends SeoPageProps>(PageComponent: NextPage<T>): NextPage<T> => {
  const WithUserMe: NextPage<T> = (pageProps: T) => {
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
      return <ErrorTemplate variant="offline" seoProps={pageProps.seoProps} />;
    }

    if (!authLoading && !authNetworkError) {
      return <PageComponent {...pageProps} />;
    }

    return <LoadingTemplate seoProps={pageProps.seoProps} />;
  };

  return withCommonContexts(WithUserMe);
};
