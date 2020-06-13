import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, GraphQLRequest } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { HttpConfig } from 'apollo-link-http-common';
import { createUploadLink } from 'apollo-upload-client';
import fetch from 'isomorphic-unfetch';
import { NextPageContext } from 'next';
import * as R from 'ramda';
import { i18n } from 'src/i18n';

import { env } from '../config';
import { getTokenCookie } from './auth-cookies';

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

const createApolloClient = (ctx?: NextPageContext): ApolloClient<NormalizedCacheObject> => {
    const isBrowser = typeof window !== 'undefined';
    const uri = isBrowser ? env.API_URL : env.BACKEND_URL;
    const token = !!ctx && !!ctx.req && getTokenCookie(ctx.req);

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

export const initApolloClient = (ctx?: NextPageContext): ApolloClient<NormalizedCacheObject> => {
    const _apolloClient = apolloClient || createApolloClient(ctx);

    // For SSG and SSR always create a new Apollo Client.
    if (typeof window === 'undefined') return _apolloClient;
    // Create the Apollo Client once in the client.
    if (!apolloClient) apolloClient = _apolloClient;

    return _apolloClient;
};
