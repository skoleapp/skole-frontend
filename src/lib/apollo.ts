import {
  ApolloClient,
  InMemoryCache,
  QueryOptions,
  WatchQueryOptions,
} from '@apollo/client';
import { NormalizedCacheObject } from '@apollo/client/cache';
import { MutationBaseOptions } from '@apollo/client/core/watchQueryOptions';
import { createUploadLink } from 'apollo-upload-client';
import { useMemo } from 'react';

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

const createApolloClient = (): ApolloClient<NormalizedCacheObject> => {
  const isBrowser = typeof window !== 'undefined';
  const uri = isBrowser ? process.env.API_URL : process.env.BACKEND_URL;

  const httpLink = createUploadLink({
    uri: uri + 'graphql/',
    credentials: 'include',
  });

  const fetchPolicyOptions = {
    fetchPolicy: 'no-cache', // Disable caching to make sure we always get the correct translations and content.
  };

  return new ApolloClient({
    ssrMode: isBrowser,
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      query: fetchPolicyOptions as Partial<QueryOptions>,
      watchQuery: fetchPolicyOptions as Partial<WatchQueryOptions>,
      mutate: fetchPolicyOptions as Partial<MutationBaseOptions>,
    },
  });
};

export const initApolloClient = (
  initialState: NormalizedCacheObject | null = null,
): ApolloClient<NormalizedCacheObject> => {
  const _apolloClient = apolloClient || createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state gets hydrated here.
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }

  // For SSG and SSR always create a new Apollo Client.
  if (typeof window === 'undefined') {
    return _apolloClient;
  }

  // Create the Apollo Client once in the client.
  if (!apolloClient) {
    apolloClient = _apolloClient;
  }

  return _apolloClient;
};

// A client side hook to retrieve apollo client with initial state from cache.
export const useApollo = (
  initialState: NormalizedCacheObject,
): ApolloClient<NormalizedCacheObject> => {
  return useMemo(() => initApolloClient(initialState), [initialState]);
};
