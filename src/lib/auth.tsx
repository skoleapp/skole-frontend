import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { useAuthContext } from 'context';
import { UserMeDocument } from 'generated/graphql';
import { Router } from 'i18n';
import { GetServerSideProps, NextPage } from 'next';
import * as R from 'ramda';
import { useEffect } from 'react';
import React from 'react';

import { initApolloClient } from '.';

// Sync authentication between pages -> automatically redirect to login if multiple browser windows are open.
// Wrap all pages that require authentication with this.
export const withAuthSync = <T extends {}>(PageComponent: NextPage<T>): NextPage => {
    const WithAuthSync: NextPage = pageProps => {
        const { user } = useAuthContext();

        const syncLogout = (e: StorageEvent): void => {
            if (e.key === 'logout') {
                Router.push('/login');
            }
        };

        useEffect(() => {
            window.addEventListener('storage', syncLogout);

            return (): void => {
                window.removeEventListener('storage', syncLogout);
                window.localStorage.removeItem('logout');
            };
        }, [user]);

        return <PageComponent {...(pageProps as T)} />;
    };

    return WithAuthSync;
};

// Redirect unauthenticated users to login before rendering page.
// Wrap `getServerSideProps` method with this for all pages that require authentication.
export const withSSRAuth = (getServerSidePropsInner: GetServerSideProps): GetServerSideProps => {
    const getServerSideProps: GetServerSideProps = async ctx => {
        const result = await getServerSidePropsInner(ctx);
        const initState: NormalizedCacheObject | null = R.propOr(null, 'initialApolloState', ctx);
        const apolloClient = initApolloClient(initState, ctx);
        const initialApolloState = apolloClient.cache.extract();
        const { url } = ctx.req;
        let user = null;

        try {
            const { data } = await apolloClient.query({ query: UserMeDocument });
            user = data.userMe;
        } catch {
            const Location = !!url && url !== '/' ? `/login?next=${url}` : '/login';
            ctx.res.writeHead(302, { Location });
            ctx.res.end();
        }

        return {
            ...result,
            props: {
                ...result.props,
                initialApolloState,
                user,
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
        let user = null;

        try {
            const { data } = await apolloClient.query({ query: UserMeDocument });
            user = data.userMe;

            if (!!user) {
                ctx.res.writeHead(302, { Location: '/' });
                ctx.res.end();
            }
        } catch {}

        return {
            ...result,
            props: {
                ...result.props,
                initialApolloState,
                user,
            },
        };
    };

    return getServerSideProps;
};
