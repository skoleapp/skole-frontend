import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { NextPageContext } from 'next';

interface CustomApolloClient extends ApolloClient<NormalizedCacheObject> {
    toJSON: () => void;
}

export interface ApolloContext extends NextPageContext {
    apolloClient: CustomApolloClient;
    apolloState: {};
}
