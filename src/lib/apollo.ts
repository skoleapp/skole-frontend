import { ApolloClient, InMemoryCache } from '@apollo/client';
import { NormalizedCacheObject } from '@apollo/client/cache';
import { createUploadLink } from 'apollo-upload-client';
import { env } from 'config';
import { IncomingMessage } from 'http';
import { i18n } from 'lib';
import * as R from 'ramda';
import { useMemo } from 'react';
import { SSRContext } from 'types';

import { getTokenCookie } from './auth-cookies';

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

const createApolloClient = (ctx?: SSRContext): ApolloClient<NormalizedCacheObject> => {
    const isBrowser = typeof window !== 'undefined';
    const uri = isBrowser ? env.API_URL : env.BACKEND_URL;
    const req: IncomingMessage | undefined = R.propOr(undefined, 'req', ctx);
    const token = getTokenCookie(req);

    const link = createUploadLink({
        uri: uri + 'graphql/',
        credentials: 'include',
        headers: {
            Authorization: token ? `JWT ${token}` : '',
            'Accept-Language': i18n.language || R.path(['req', 'language'], ctx),
        },
    });

    return new ApolloClient({
        ssrMode: isBrowser,
        // Ignore: Apollo client's types have been updated so that they do not match apollo-upload-client's types.
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        link,
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
