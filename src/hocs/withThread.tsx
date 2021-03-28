import { ImageViewer } from 'components';
import { ThreadContextProvider } from 'context';
import { NextPage } from 'next';
import React from 'react';

export const withThread = (PageComponent: NextPage): NextPage => {
  const WithThreadContext: NextPage = (pageProps) => (
    <ThreadContextProvider>
      <PageComponent {...pageProps} />
      <ImageViewer />
    </ThreadContextProvider>
  );

  return WithThreadContext;
};
