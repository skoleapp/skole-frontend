import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, GraphQLRequest } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { HttpConfig } from 'apollo-link-http-common';
import { createUploadLink } from 'apollo-upload-client';
import { IncomingMessage } from 'http';
import fetch from 'isomorphic-unfetch';
import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { WithApolloClient } from 'react-apollo';

import { SkoleContext } from '../types';
import { getToken } from '../utils';

interface GetToken {
    getToken: (req?: IncomingMessage) => string;
}

export const withApollo = (PageComponent: NextPage, { ssr = true } = {}): JSX.Element => {
    let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

    const createApolloClient = (initialState = {}, { getToken }: GetToken): ApolloClient<NormalizedCacheObject> => {
        const isBrowser = typeof window !== 'undefined';
        const uri = isBrowser ? process.env.API_URL : process.env.BACKEND_URL;

        console.log('API_URL', process.env.API_URL);
        console.log('BACKEND_URL', process.env.BACKEND_URL);
        console.log('CLOUDMERSIVE_API_KEY', process.env.CLOUDMERSIVE_API_KEY);
        console.log('NODE_ENV', process.env.NODE_ENV);

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

    const initApolloClient = (initState = {}, { getToken }: GetToken): ApolloClient<NormalizedCacheObject> | null => {
        if (typeof window === 'undefined') {
            return createApolloClient(initState, { getToken });
        }

        if (!apolloClient) {
            apolloClient = createApolloClient(initState, { getToken });
        }

        return apolloClient;
    };

    const WithApollo = ({ apolloClient, apolloState, ...pageProps }: WithApolloClient<SkoleContext>): JSX.Element => {
        const client = apolloClient || initApolloClient(apolloState, { getToken });

        return (
            <ApolloProvider client={client as ApolloClient<NormalizedCacheObject>}>
                <PageComponent {...(pageProps as {})} />
            </ApolloProvider>
        );
    };

    if (process.env.NODE_ENV !== 'production') {
        const displayName = PageComponent.displayName || PageComponent.name || 'Component';

        if (displayName === 'App') {
            console.warn('This withApollo HOC only works with PageComponents.');
        }

        WithApollo.displayName = `withApollo(${displayName})`;
    }

    if (ssr || PageComponent.getInitialProps) {
        WithApollo.getInitialProps = async (ctx: WithApolloClient<SkoleContext>): Promise<{}> => {
            const { AppTree } = ctx;
            const apolloClient = ((ctx.apolloClient as ApolloClient<NormalizedCacheObject> | null) = initApolloClient(
                {},
                { getToken: () => getToken(ctx.req) },
            ));
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

            const apolloState = apolloClient && (apolloClient.cache.extract() as unknown);

            return {
                ...pageProps,
                apolloState,
            };
        };
    }

    return (WithApollo as unknown) as JSX.Element;
};
