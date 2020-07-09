import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, GraphQLRequest } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { HttpConfig } from 'apollo-link-http-common';
import { createUploadLink } from 'apollo-upload-client';
import { IncomingMessage } from 'http';
import fetch from 'isomorphic-unfetch';
import * as R from 'ramda';
import { useMemo } from 'react';
import { SSRContext } from 'src/types';

import { env } from '../config';
import { i18n } from '../i18n';
import { getTokenCookie } from './auth-cookies';

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

const createApolloClient = (ctx?: SSRContext): ApolloClient<NormalizedCacheObject> => {
    const isBrowser = typeof window !== 'undefined';
    const uri = isBrowser ? env.API_URL : env.BACKEND_URL;
    const req: IncomingMessage | undefined = R.propOr(undefined, 'req', ctx);
    const token = getTokenCookie(req);

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
        ssrMode: isBrowser,
        link: ApolloLink.from([authLink, httpLink]),
        cache: new InMemoryCache(),
    });
};

export const initApolloClient = (
    initialState: NormalizedCacheObject | null = null,
    ctx?: SSRContext,
): ApolloClient<NormalizedCacheObject> => {
    const _apolloClient = apolloClient || createApolloClient(ctx);

    // If your page has Next.js data fetching methods that use Apollo Client, the initial state gets hydrated here.
    if (initialState) {
        _apolloClient.cache.restore(initialState);
    }

    // For SSG and SSR always create a new Apollo Client.
    if (typeof window === 'undefined') return _apolloClient;
    // Create the Apollo Client once in the client.
    if (!apolloClient) apolloClient = _apolloClient;

    return _apolloClient;
};

// A client side hook to retrieve apollo client with initial state from cache.
export const useApollo = (initialState: NormalizedCacheObject): ApolloClient<NormalizedCacheObject> => {
    return useMemo(() => initApolloClient(initialState), [initialState]);
};

interface UseSSRApollo {
    apolloClient: ApolloClient<NormalizedCacheObject>;
    initialApolloState: NormalizedCacheObject;
}

// An SSR hook to initialize apollo client and state from cache.
export const useSSRApollo = (ctx: SSRContext): UseSSRApollo => {
    const apolloClient = initApolloClient(null, ctx);
    const initialApolloState = apolloClient.cache.extract();
    return { apolloClient, initialApolloState };
};
