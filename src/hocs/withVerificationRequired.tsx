import { LoadingTemplate } from 'components';
import { useAuthContext } from 'context';
import { NextPage } from 'next';
import Router from 'next/router';
import React, { useEffect } from 'react';
import { urls } from 'utils';

import { withAuthRequired } from './withAuthRequired';

export const withVerificationRequired = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithVerificationRequiredMode: NextPage<T> = (pageProps: T) => {
    const { verified } = useAuthContext();

    useEffect(() => {
      if (verified === false) {
        Router.push(urls.verifyAccount);
      }
    }, [verified]);

    // Show loading screen while redirecting to verify account page.
    if (verified === false) {
      return <LoadingTemplate />;
    }

    return <PageComponent {...pageProps} />;
  };

  return withAuthRequired(WithVerificationRequiredMode);
};
