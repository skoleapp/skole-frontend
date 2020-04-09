import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, GraphQLRequest } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { HttpConfig } from 'apollo-link-http-common';
import { createUploadLink } from 'apollo-upload-client';
import fetch from 'isomorphic-unfetch';
import cookie from 'js-cookie';
import { NextPage } from 'next';
import nextCookie from 'next-cookies';
import Head from 'next/head';
import React from 'react';
import { WithApolloClient } from 'react-apollo';

import { i18n } from '../i18n';
import { SkoleContext } from '../types';

interface GetToken {
    getToken: (ctx?: WithApolloClient<SkoleContext>) => string;
}

// Parse cookie either in the server or in the browser.
export const getToken = (ctx?: WithApolloClient<SkoleContext>): string => {
    if (!!ctx) {
        const { token } = nextCookie(ctx);
        return token || '';
    } else {
        return cookie.get('token') || '';
    }
};

export const withApollo = (PageComponent: NextPage, { ssr = true } = {}): JSX.Element => {
    let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

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
                    Authorization: token ? `JWT ${token}` : '',
                    'Accept-Language': i18n.language,
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
                { getToken: () => getToken(ctx) },
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
