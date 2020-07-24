import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { useAuthContext } from 'context';
import { UserMeDocument } from 'generated/graphql';
import { Router } from 'i18n';
import { initApolloClient } from 'lib';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import { useEffect } from 'react';
import React from 'react';
import { urls } from 'utils';

// Sync authentication between pages.
// Wrap all pages that require authentication with this.
export const withAuthSync = <T extends {}>(PageComponent: NextPage<T>): NextPage => {
    const WithAuthSync: NextPage = pageProps => {
        const { userMe } = useAuthContext();
        const { pathname } = useRouter();

        const syncLogout = (e: StorageEvent): void => {
            if (e.key === 'logout') {
                Router.push(urls.login);
            }
        };

        // Automatically redirect unauthenticated users to login.
        // We do this on client side on purpose so that all pages get indexed properly.
        useEffect(() => {
            const url = !!pathname && pathname !== urls.home ? `${urls.login}?next=${pathname}` : urls.login;
            !userMe && Router.push(url);
        }, []);

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

// Redirect unauthenticated users to landing page before rendering page if they are already authenticated.
// Wrap `getServerSideProps` method with this for all pages that are intended for only unauthenticated users.
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

            if (!!userMe) {
                ctx.res.writeHead(302, { Location: urls.home });
                ctx.res.end();
            }
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
