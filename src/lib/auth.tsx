import { LoadingLayout, OfflineLayout } from 'components';
import { useUserMe } from 'hooks';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { GET_STARTED_PAGE_VISITED_KEY, redirect, urls } from 'utils';

// Sync authentication between pages.
// Wrap all pages that require authentication with this.
export const withAuth = <T extends {}>(PageComponent: NextPage<T>): NextPage => {
    const withAuth: NextPage = pageProps => {
        const { userMe, authLoading, authNetworkError } = useUserMe();
        const shouldRedirect = !(authLoading || authNetworkError || !!userMe);
        const { asPath } = useRouter();

        const syncLogout = async (e: StorageEvent): Promise<void> => {
            if (e.key === 'logout') {
                await redirect(urls.logout);
            }
        };

        // Automatically redirect user to get started/login page if not authenticated.
        useEffect(() => {
            if (shouldRedirect) {
                const query = asPath !== urls.home ? { next: asPath } : undefined;
                const existingUser = localStorage.getItem('user');
                const getStartedPageVisited = !!localStorage.getItem(GET_STARTED_PAGE_VISITED_KEY);

                // Only redirect new users to get started page (users who have already logged in at some point).
                // Redirect old users and users who have visited get started page to login page.
                if (!!existingUser || getStartedPageVisited) {
                    redirect({ pathname: urls.confirmLogin, query });
                } else {
                    redirect({ pathname: urls.getStarted, query });
                }
            }
        }, [shouldRedirect]);

        // Automatically redirect to login if multiple browser windows are open and user logs out.
        useEffect(() => {
            window.addEventListener('storage', syncLogout);

            return (): void => {
                window.removeEventListener('storage', syncLogout);
                localStorage.removeItem('logout');
            };
        }, []);

        if (authLoading) {
            return <LoadingLayout />;
        }

        if (authNetworkError) {
            return <OfflineLayout />;
        }

        return <PageComponent {...(pageProps as T)} />;
    };

    return withAuth;
};

// Disable access for authenticated users.
// Wrap all pages that require access only for unauthenticated users with this for all pages.
export const withNoAuth = <T extends {}>(PageComponent: NextPage<T>): NextPage => {
    const WithNoAuth: NextPage = pageProps => {
        const { userMe, authLoading, authNetworkError } = useUserMe();
        const { asPath } = useRouter();

        // Automatically redirect user to logout if he is authenticated.
        useEffect(() => {
            !!userMe && redirect({ pathname: urls.confirmLogout, query: { next: asPath } });
        }, [userMe]);

        if (authLoading) {
            return <LoadingLayout />;
        }

        if (authNetworkError) {
            return <OfflineLayout />;
        }

        return <PageComponent {...(pageProps as T)} />;
    };

    return WithNoAuth;
};

// Fetch user from API and set context with the value.
// If user has not visited get started page, redirect there.
// Wrap all pages that do not require authentication with this.
export const withUserMe = <T extends {}>(PageComponent: NextPage<T>): NextPage => {
    const WithUserMe: NextPage = pageProps => {
        const { authLoading, authNetworkError } = useUserMe();
        const { asPath } = useRouter();

        useEffect(() => {
            const getStartedPageVisited = !!localStorage.getItem(GET_STARTED_PAGE_VISITED_KEY);
            !getStartedPageVisited && redirect({ pathname: urls.getStarted, query: { next: asPath } });
        }, []);

        if (authLoading) {
            return <LoadingLayout />;
        }

        if (authNetworkError) {
            return <OfflineLayout />;
        }

        return <PageComponent {...(pageProps as T)} />;
    };

    return WithUserMe;
};
