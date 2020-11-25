import { AttachmentViewer, CommentThreadModal } from 'components';
import { DiscussionContextProvider } from 'context';
import { NextPage } from 'next';
import React from 'react';

// Provide discussion context for child components.
export const withDiscussion = (PageComponent: NextPage): NextPage => {
  const WithDiscussion: NextPage = (pageProps) => (
    <DiscussionContextProvider>
      <PageComponent {...pageProps} />
      <AttachmentViewer />
      <CommentThreadModal />
    </DiscussionContextProvider>
  );

  return WithDiscussion;
};
