import { DiscussionContextProvider } from 'context';
import { NextPage } from 'next';
import React from 'react';

// Provide PDF viewer context for child components.
export const withPdfViewer = <T extends {}>(PageComponent: NextPage<T>): NextPage => {
    const WithPdfViewer: NextPage = pageProps => (
        <DiscussionContextProvider>
            <PageComponent {...(pageProps as T)} />
        </DiscussionContextProvider>
    );

    return WithPdfViewer;
};
