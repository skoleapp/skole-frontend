import { ApolloClient } from '@apollo/client';
import { NormalizedCacheObject } from '@apollo/client/cache';
import { NextPageContext } from 'next';

interface CustomApolloClient extends ApolloClient<NormalizedCacheObject> {
  toJSON: () => void;
}

export interface ApolloContext extends NextPageContext {
  apolloClient: CustomApolloClient;
  apolloState: Record<symbol, unknown>;
}
