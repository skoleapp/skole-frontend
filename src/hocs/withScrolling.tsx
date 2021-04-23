import { ScrollingContextProvider } from 'context';
import { NextPage } from 'next';
import React from 'react';

export const withScrolling = (PageComponent: NextPage): NextPage => {
  const WithScrolling: NextPage = (pageProps) => (
    <ScrollingContextProvider>
      <PageComponent {...pageProps} />
    </ScrollingContextProvider>
  );

  return WithScrolling;
};
