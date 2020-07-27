import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { useAuthContext } from 'context';
import { UserMeDocument } from 'generated/graphql';
import { initApolloClient } from 'lib';
import { GetServerSideProps, NextPage } from 'next';
import * as R from 'ramda';
import React, { useEffect } from 'react';
import { redirect, urls } from 'utils';

// Sync authentication between pages.
// Wrap all pages that require authentication with this.
export const withAuthSync = <T extends {}>(PageComponent: NextPage<T>): NextPage => {
    const WithAuthSync: NextPage = pageProps => {
        const { userMe } = useAuthContext();

        const syncLogout = (e: StorageEvent): void => {
            if (e.key === 'logout') {
                redirect(urls.login);
            }
        };

        // Automatically redirect to login if multiple browser windows are open and user logs out.
        useEffect(() => {
            window.addEventListener('storage', syncLogout);

            return (): void => {
                window.removeEventListener('storage', syncLogout);
                window.localStorage.removeItem('logout');
            };
        }, [userMe]);

        return <PageComponent {...(pageProps as T)} />;
    };

    return WithAuthSync;
};

// Disable access for authenticated users.
// Wrap `getServerSideProps` method with this for all pages that require access only for unauthenticated users.
export const withNoAuth = (getServerSidePropsInner: GetServerSideProps): GetServerSideProps => {
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

        // Automatically redirect user to logout confirmation page if user is authenticated.
        if (!!userMe) {
            redirect(urls.confirmLogout, ctx);
        }

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

// Fetch user from API and set it in the context in a wrapper component.
// Wrap `getServerSideProps` method with this for all pages that require authentication.
export const withSSRAuth = (getServerSidePropsInner: GetServerSideProps): GetServerSideProps => {
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

        // Automatically redirect user to get started page if he is not authenticated.
        if (!userMe) {
            const { url } = ctx.req;
            const location = url === urls.home ? urls.getStarted : `${urls.getStarted}?next=${url}`;
            redirect(location, ctx);
        }

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

// Provide user as a prop for to wrapper component that initializes context.
// Wrap `getServerSideProps` method with this for all pages that do not require authentication.
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
