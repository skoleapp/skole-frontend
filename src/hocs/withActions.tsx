import { ActionsDialog } from 'components';
import { ActionsContextProvider } from 'context';
import { NextPage } from 'next';
import React from 'react';

export const withActions = (PageComponent: NextPage): NextPage => {
  const WithActions: NextPage = (pageProps) => (
    <ActionsContextProvider>
      <PageComponent {...pageProps} />
      <ActionsDialog />
    </ActionsContextProvider>
  );

  return WithActions;
};
