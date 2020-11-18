import { AttachmentViewer, CommentThreadModal } from 'components';
import { DiscussionContextProvider } from 'context';
import { NextPage } from 'next';
import React from 'react';

// Provide discussion context for child components.
export const withDiscussion = <T extends Record<symbol, unknown>>(
  PageComponent: NextPage<T>
): NextPage => {
  const WithDiscussion: NextPage = (pageProps) => (
    <DiscussionContextProvider>
      <PageComponent {...(pageProps as T)} />
      <AttachmentViewer />
      <CommentThreadModal />
    </DiscussionContextProvider>
  );

  return WithDiscussion;
};
