import { LoadingTemplate, OfflineTemplate } from 'components';
import { useUserMe } from 'hooks';
import { NextPage } from 'next';
import React from 'react';
import { withCommonContexts } from './withCommonContexts';

// Fetch user from API and set context with the value.
// Wrap all pages that do not require authentication with this.
export const withUserMe = (PageComponent: NextPage): NextPage => {
  const WithUserMe: NextPage = (pageProps) => {
    const { authLoading, authNetworkError } = useUserMe();

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
