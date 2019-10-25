import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import Head from 'next/head';
import React from 'react';
import { SkoleContext } from '../interfaces';
import { getToken } from './getToken';

export const withApollo = (PageComponent: any, { ssr = true } = {}): any => {
  const WithApollo = ({ apolloClient, apolloState, ...pageProps }: any): any => {
    const client = apolloClient || initApolloClient(apolloState, { getToken });
    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
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
    WithApollo.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
      const { AppTree } = ctx;
      const apolloClient = (ctx.apolloClient = initApolloClient(
        {},
        {
          getToken: () => getToken(ctx.req)
        }
      ));
      const pageProps = PageComponent.getInitialProps
        ? await PageComponent.getInitialProps(ctx)
        : {};
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
                  apolloClient
                }}
              />
            );
          } catch (error) {
            console.error('Error while running `getDataFromTree`', error);
          }
        }
        Head.rewind();
      }

      const apolloState = apolloClient.cache.extract();

      return {
        ...pageProps,
        apolloState
      };
    };
  }

  return WithApollo;
};

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

// eslint-disable-next-line
const initApolloClient = (initState: any, { getToken }: any) => {
  if (typeof window === 'undefined') {
    return createApolloClient(initState, { getToken });
  }

  if (!apolloClient) {
    apolloClient = createApolloClient(initState, { getToken });
  }

  return apolloClient;
};

// eslint-disable-next-line
const createApolloClient = (initialState = {}, { getToken }: any) => {
  const httpLink = new HttpLink({
    uri: 'http://localhost:8000/graphql/',
    credentials: 'include',
    fetch
  });

  const authLink = setContext((_req, { headers }) => {
    const token = getToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `JWT ${token}` : ''
      }
    };
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: authLink.concat(httpLink),
    cache: new InMemoryCache().restore(initialState)
  });
};
