import { ThreadFormDialog } from 'components';
import { ThreadFormContextProvider } from 'context';
import { NextPage } from 'next';
import React from 'react';

export const withThreadForm = (PageComponent: NextPage): NextPage => {
  const WithThreadForm: NextPage = (pageProps) => (
    <ThreadFormContextProvider>
      <PageComponent {...pageProps} />
      <ThreadFormDialog />
    </ThreadFormContextProvider>
  );

  return WithThreadForm;
};
