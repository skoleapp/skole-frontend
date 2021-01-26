import { InfoDialog } from 'components';
import { InfoContextProvider } from 'context';
import { NextPage } from 'next';
import React from 'react';

export const withInfo = (PageComponent: NextPage): NextPage => {
  const WithInfo: NextPage = (pageProps) => (
    <InfoContextProvider>
      <PageComponent {...pageProps} />
      <InfoDialog />
    </InfoContextProvider>
  );

  return WithInfo;
};
