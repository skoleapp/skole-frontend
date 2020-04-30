import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, GraphQLRequest } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { HttpConfig } from 'apollo-link-http-common';
import { createUploadLink } from 'apollo-upload-client';
import fetch from 'isomorphic-unfetch';
import cookie from 'js-cookie';
import { GetServerSideProps } from 'next';
import nextCookie from 'next-cookies';
import NextHead from 'next/head';
import * as R from 'ramda';
import React from 'react';

import { env } from '../config';
import { i18n } from '../i18n';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Ctx = any; // TODO: Find proper types for this.

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

const createApolloClient = (
    initialState: NormalizedCacheObject = {},
    ctx?: Ctx,
): ApolloClient<NormalizedCacheObject> => {
    const isBrowser = typeof window !== 'undefined';
    const uri = isBrowser ? env.API_URL : env.BACKEND_URL;
    const token = !!ctx ? nextCookie(ctx).token : cookie.get('token');

    const httpLink = createUploadLink({
        uri: uri + 'graphql/',
        credentials: 'include',
        fetch,
    });

    const authLink = setContext((_req: GraphQLRequest, { headers }: HttpConfig) => ({
        headers: {
            ...headers,
            Authorization: token ? `JWT ${token}` : '',
            'Accept-Language': i18n.language || R.path(['req', 'language'], ctx),
        },
    }));

    return new ApolloClient({
        ssrMode: !!ctx,
        link: ApolloLink.from([authLink, httpLink]),
        cache: new InMemoryCache().restore(initialState),
    });
};

export const initApolloClient = (
    initialState?: NormalizedCacheObject,
    ctx?: Ctx,
): ApolloClient<NormalizedCacheObject> => {
    if (typeof window === 'undefined') {
        return createApolloClient(initialState, ctx);
    }

    if (!apolloClient) {
        apolloClient = createApolloClient(initialState, ctx);
    }

    return apolloClient;
};

export const initOnContext = (ctx: Ctx): Ctx => {
    const apolloClient = ctx.apolloClient || initApolloClient(ctx.apolloState || {}, ctx);
    ctx.apolloClient = apolloClient;
    apolloClient.toJSON = (): null => null;
    return ctx;
};

// Wrap `getServerSideProps` with this for all pages that require server-side apollo client.
export const withApolloSSR = (getServerSidePropsInner: GetServerSideProps): GetServerSideProps => {
    const getServerSideProps: GetServerSideProps = async (ctx: Ctx) => {
        const { apolloClient } = initOnContext(ctx);
        const result = await getServerSidePropsInner(ctx);
        const { AppTree } = ctx;

        if (ctx.res && ctx.res.finished) {
            return result;
        }

        if (AppTree) {
            try {
                const { getDataFromTree } = await import('@apollo/react-ssr');
                await getDataFromTree(<AppTree pageProps={{ ...result.props, apolloClient }} />);
            } catch (error) {
                console.error('Error while running `getDataFromTree`', error);
            }

            NextHead.rewind();
        }

        return {
            ...result,
            props: {
                ...result.props,
                apolloState: apolloClient.cache.extract(),
                apolloClient: ctx.apolloClient.toJSON(),
            },
        };
    };

    return getServerSideProps;
};
