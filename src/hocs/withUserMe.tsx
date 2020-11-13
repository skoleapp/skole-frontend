import { LoadingLayout, OfflineLayout } from 'components';
import { useUserMe } from 'hooks';
import { NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { GET_STARTED_PAGE_VISITED_KEY, urls } from 'utils';

// Fetch user from API and set context with the value.
// If user has not visited get started page, redirect there.
// Wrap all pages that do not require authentication with this.
export const withUserMe = <T extends {}>(PageComponent: NextPage<T>): NextPage => {
    const WithUserMe: NextPage = pageProps => {
        const { authNetworkError } = useUserMe();
        const { asPath } = useRouter();
        const [shouldRedirect, setShouldRedirect] = useState(false);

        useEffect(() => {
            const getStartedPageVisited = !!localStorage.getItem(GET_STARTED_PAGE_VISITED_KEY);

            if (!getStartedPageVisited) {
                setShouldRedirect(true);
                Router.push({ pathname: urls.getStarted, query: { next: asPath } });
            }
        }, []);

        if (authNetworkError) {
            return <OfflineLayout />;
        }

        if (shouldRedirect) {
            return <LoadingLayout />;
        }

        return <PageComponent {...(pageProps as T)} />;
    };

    return WithUserMe;
};
