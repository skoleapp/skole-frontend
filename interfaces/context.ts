import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { NextPageContext } from 'next';
import { Store } from 'redux';
import { UserMe } from './auth';

export interface SkoleContext extends NextPageContext {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  reduxStore: Store;
  userMe: UserMe;
}
