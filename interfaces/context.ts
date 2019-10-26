import ApolloClient from 'apollo-client';
import { NextPageContext } from 'next';
import { Store } from 'redux';
import { User } from './store';

export interface SkoleContext extends NextPageContext {
  apolloClient: ApolloClient<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  reduxStore: Store;
  userMe: User;
}
