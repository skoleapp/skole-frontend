import { LoadingLayout, OfflineLayout } from 'components';
import { useAuthContext } from 'context';
import { useUserMe } from 'hooks';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { redirect, urls } from 'utils';

// Sync authentication between pages.
// Wrap all pages that require authentication with this.
export const withAuth = <T extends {}>(PageComponent: NextPage<T>): NextPage => {
    const withAuth: NextPage = pageProps => {
        const { loading, networkError } = useUserMe();
        const { userMe } = useAuthContext();
        const shouldRedirect = !(loading || networkError || userMe);
        const { asPath } = useRouter();

        const syncLogout = (e: StorageEvent): void => {
            if (e.key === 'logout') {
                redirect(urls.login);
            }
        };

        // Automatically redirect user to get started/login page if he is not authenticated.
        useEffect(() => {
            if (shouldRedirect) {
                const query = asPath !== urls.home ? { next: asPath } : undefined;

                // Only redirect new users to get started page.
                // Redirect old users to login page.
                if (localStorage.getItem('user')) {
                    console.log('test');
                    redirect({ pathname: urls.login, query });
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
        }, [userMe]);

        if (loading || !userMe) {
            return <LoadingLayout />;
        }

        if (networkError) {
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
        const { userMe, loading, networkError } = useUserMe();
        const { asPath } = useRouter();

        // Automatically redirect user to home page if he is authenticated.
        useEffect(() => {
            !!userMe && redirect({ pathname: urls.confirmLogout, query: { next: asPath } });
        }, []);

        if (loading) {
            return <LoadingLayout />;
        }

        if (networkError) {
            return <OfflineLayout />;
        }

        return <PageComponent {...(pageProps as T)} />;
    };

    return WithNoAuth;
};

// Fetch user from API and set context with the value.
// Wrap all pages that do not require authentication with this.
export const withUserMe = <T extends {}>(PageComponent: NextPage<T>): NextPage => {
    const WithUserMe: NextPage = pageProps => {
        const { loading, networkError } = useUserMe();

        if (loading) {
            return <LoadingLayout />;
        }

        if (networkError) {
            return <OfflineLayout />;
        }

        return <PageComponent {...(pageProps as T)} />;
    };

    return WithUserMe;
};
