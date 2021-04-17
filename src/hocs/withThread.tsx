import { ImageViewer, VotePromptDialog } from 'components';
import { ThreadContextProvider, VoteContextProvider } from 'context';
import { NextPage } from 'next';
import React from 'react';

export const withThread = (PageComponent: NextPage): NextPage => {
  const WithThreadContext: NextPage = (pageProps) => (
    <ThreadContextProvider>
      <VoteContextProvider>
        <PageComponent {...pageProps} />
        <ImageViewer />
        <VotePromptDialog />
      </VoteContextProvider>
    </ThreadContextProvider>
  );

  return WithThreadContext;
};
