import { ConfirmationDialog } from 'components';
import { DiscussionContextProvider } from 'context';
import { NextPage } from 'next';
import React from 'react';

// Provide confirm dialog context for child components.
export const withConfirmDialog = (PageComponent: NextPage): NextPage => {
  const WithDiscussion: NextPage = (pageProps) => (
    <DiscussionContextProvider>
      <PageComponent {...pageProps} />
      <ConfirmationDialog />
    </DiscussionContextProvider>
  );

  return WithDiscussion;
};
