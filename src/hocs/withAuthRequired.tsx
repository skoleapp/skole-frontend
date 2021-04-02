import { LoadingTemplate } from 'components';
import { useAuthContext } from 'context';
import { NextPage } from 'next';
import Router from 'next/router';
import React, { useEffect } from 'react';
import { urls } from 'utils';

import { withUserMe } from './withUserMe';

export const withAuthRequired = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithAuthRequiredMode: NextPage<T> = (pageProps: T) => {
    const { userMe } = useAuthContext();

    useEffect(() => {
      if (userMe === null) {
        Router.push(urls.index);
      }
    }, [userMe]);

    // Show loading screen while redirecting to landing page.
    if (!userMe) {
      return <LoadingTemplate />;
    }

    return <PageComponent {...pageProps} />;
  };

  return withUserMe(WithAuthRequiredMode);
};
