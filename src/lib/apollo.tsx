import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { GraphQLRequest, ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { HttpConfig } from 'apollo-link-http-common';
import { createUploadLink } from 'apollo-upload-client';
import { IncomingMessage } from 'http';
import fetch from 'isomorphic-unfetch';
import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { WithApolloClient } from 'react-apollo';

import { getToken } from '../utils';

interface GetToken {
    getToken: (req?: IncomingMessage) => string;
}

/* eslint-disable*/
export const withApollo = (PageComponent: NextPage, { ssr = true } = {}): NextPage => {
    const WithApollo = ({ apolloClient, apolloState, ...pageProps }: WithApolloClient<any>): WithApolloClient<any> => {
        const client = apolloClient || initApolloClient(apolloState, { getToken });
        return (
            <ApolloProvider client={client}>
                <PageComponent {...pageProps} />
            </ApolloProvider>
        );
    };
    /* eslint-enable */

    if (process.env.NODE_ENV !== 'production') {
        const displayName = PageComponent.displayName || PageComponent.name || 'Component';

        if (displayName === 'App') {
            console.warn('This withApollo HOC only works with PageComponents.');
        }

        WithApollo.displayName = `withApollo(${displayName})`;
    }

    if (ssr || PageComponent.getInitialProps) {
        WithApollo.getInitialProps = async (ctx: WithApolloClient<any>): Promise<any> => {
            const { AppTree } = ctx;
            const apolloClient = (ctx.apolloClient = initApolloClient({}, { getToken: () => getToken(ctx.req) }));
            const pageProps = PageComponent.getInitialProps ? await PageComponent.getInitialProps(ctx) : {};
            if (typeof window === 'undefined') {
                if (ctx.res && ctx.res.finished) {
                    return {};
                }
                if (ssr) {
                    try {
                        const { getDataFromTree } = await import('@apollo/react-ssr');
                        await getDataFromTree(
                            <AppTree
                                pageProps={{
                                    ...pageProps,
                                    apolloClient,
                                }}
                            />,
                        );
                    } catch (error) {
                        console.error('Error while running `getDataFromTree`', error);
                    }
                }
                Head.rewind();
            }

            const apolloState = apolloClient && apolloClient.cache.extract();

            return {
                ...pageProps,
                apolloState,
            };
        };
    }

    return WithApollo;
};

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

const initApolloClient = (initState = {}, { getToken }: GetToken): ApolloClient<NormalizedCacheObject> | null => {
    if (typeof window === 'undefined') {
        return createApolloClient(initState, { getToken });
    }

    if (!apolloClient) {
        apolloClient = createApolloClient(initState, { getToken });
    }

    return apolloClient;
};

const createApolloClient = (initialState = {}, { getToken }: GetToken): ApolloClient<NormalizedCacheObject> => {
    const isBrowser = typeof window !== 'undefined';
    const uri = isBrowser ? process.env.API_URL : process.env.BACKEND_URL;

    const httpLink = createUploadLink({
        uri: uri + 'graphql/',
        credentials: 'include',
        fetch,
    });

    const authLink = setContext((_req: GraphQLRequest, { headers }: HttpConfig) => {
        const token = getToken();

        return {
            headers: {
                ...headers,
                authorization: token ? `JWT ${token}` : '',
            },
        };
    });

    return new ApolloClient({
        connectToDevTools: isBrowser,
        ssrMode: !isBrowser,
        link: ApolloLink.from([authLink, httpLink]),
        cache: new InMemoryCache().restore(initialState),
    });
};
