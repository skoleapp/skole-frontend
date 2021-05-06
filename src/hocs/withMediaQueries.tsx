import { MediaQueryContextProvider } from 'context';
import { NextPage } from 'next';
import React from 'react';

export const withMediaQueries = (PageComponent: NextPage): NextPage => {
  const WithMediaQueries: NextPage = (pageProps) => (
    <MediaQueryContextProvider>
      <PageComponent {...pageProps} />
    </MediaQueryContextProvider>
  );

  return WithMediaQueries;
};
