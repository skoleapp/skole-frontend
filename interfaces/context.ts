import ApolloClient from 'apollo-client';
import { NextPageContext } from 'next';
import { Store } from 'redux';
import { UserMe } from './auth';

export interface SkoleContext extends NextPageContext {
  apolloClient: ApolloClient<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  reduxStore: Store;
  userMe: UserMe;
}
