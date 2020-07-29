import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { LoadingLayout } from 'components';
import { useAuthContext } from 'context';
import { UserMeDocument } from 'generated/graphql';
import { initApolloClient } from 'lib';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useEffect } from 'react';
import { redirect, urls } from 'utils';

// Sync authentication between pages.
// Wrap all pages that require authentication with this.
export const withAuth = <T extends {}>(PageComponent: NextPage<T>): NextPage => {
    const withAuth: NextPage = pageProps => {
        const { userMe } = useAuthContext();
        const { asPath } = useRouter();

        const syncLogout = (e: StorageEvent): void => {
            if (e.key === 'logout') {
                redirect(urls.login);
            }
        };

        // Automatically redirect user to get started page if he is not authenticated.
        useEffect(() => {
            if (!userMe) {
                const pathname = asPath;
                const query = pathname !== urls.home ? { next: pathname } : undefined;
                redirect({ pathname: urls.getStarted, query });
            }
        }, []);

        // Automatically redirect to login if multiple browser windows are open and user logs out.
        useEffect(() => {
            window.addEventListener('storage', syncLogout);

            return (): void => {
                window.removeEventListener('storage', syncLogout);
                window.localStorage.removeItem('logout');
            };
        }, [userMe]);

        return !!userMe ? <PageComponent {...(pageProps as T)} /> : <LoadingLayout />;
    };

    return withAuth;
};

// Disable access for authenticated users.
// Wrap all pages that require access only for unauthenticated users with this for all pages.
export const withNoAuth = <T extends {}>(PageComponent: NextPage<T>): NextPage => {
    const WithNoAuth: NextPage = pageProps => {
        const { userMe } = useAuthContext();

        // Automatically redirect user to home page if he is authenticated.
        useEffect(() => {
            !!userMe && redirect(urls.home);
        }, []);

        return !userMe ? <PageComponent {...(pageProps as T)} /> : <LoadingLayout />;
    };

    return WithNoAuth;
};

// Provide user as a prop for to wrapper component that initializes context.
// Wrap `getServerSideProps` method with this for all pages.
export const withUserMe = (getServerSidePropsInner: GetServerSideProps): GetServerSideProps => {
    const getServerSideProps: GetServerSideProps = async ctx => {
        const result = await getServerSidePropsInner(ctx);
        const initState: NormalizedCacheObject | null = R.propOr(null, 'initialApolloState', ctx);
        const apolloClient = initApolloClient(initState, ctx);
        const initialApolloState = apolloClient.cache.extract();
        let userMe = null;

        try {
            const { data } = await apolloClient.query({ query: UserMeDocument });
            userMe = data.userMe;
        } catch {}

        return {
            ...result,
            props: {
                ...result.props,
                initialApolloState,
                userMe,
            },
        };
    };

    return getServerSideProps;
};
