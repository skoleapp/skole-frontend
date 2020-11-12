import { AttachmentViewer, CommentThreadModal } from 'components';
import { DiscussionContextProvider } from 'context';
import { NextPage } from 'next';
import React from 'react';

export const withDiscussion = <T extends {}>(PageComponent: NextPage<T>): NextPage => {
    const WithDiscussion: NextPage = pageProps => (
        <DiscussionContextProvider>
            <PageComponent {...(pageProps as T)} />
            <AttachmentViewer />
            <CommentThreadModal />
        </DiscussionContextProvider>
    );

    return WithDiscussion;
};
