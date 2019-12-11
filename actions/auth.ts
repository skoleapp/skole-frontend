import ApolloClient from 'apollo-client';
import cookie from 'cookie';
import Router from 'next/router';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { UserMeDocument } from '../generated/graphql';
import { User } from '../interfaces';
import { openNotification } from './notifications';

export const AUTHENTICATE = 'AUTHENTICATED';
export const RE_AUTHENTICATE = 'REAUTHENTICATED';
export const DE_AUTHENTICATE = 'DEAUTHENTICATED';

interface SignInParams {
  client: ApolloClient<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  token: string;
  user: User;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authenticate: any = ({ client, token, user }: SignInParams) => async (
  dispatch: Dispatch<AnyAction>
): Promise<void> => {
  document.cookie = cookie.serialize('token', token, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/'
  });

  dispatch({ type: AUTHENTICATE, payload: user });
  await client.cache.reset();
  await Router.push('/profile');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUserMe: any = (apolloClient: ApolloClient<any>) => async (
  dispatch: Dispatch<AnyAction>
): Promise<void> => {
  const { data } = await apolloClient.query({ query: UserMeDocument });
  dispatch({ type: AUTHENTICATE, payload: data.userMe });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const reAuthenticate: any = (userMe: User) => (dispatch: Dispatch<AnyAction>): void => {
  dispatch({ type: RE_AUTHENTICATE, payload: userMe });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deAuthenticate: any = (apolloClient: ApolloClient<any>) => async (
  dispatch: Dispatch<AnyAction>
): Promise<void> => {
  document.cookie = cookie.serialize('token', '', {
    maxAge: -1,
    path: '/'
  });

  dispatch({ type: DE_AUTHENTICATE });
  dispatch(openNotification('Signed out!'));
  await apolloClient.cache.reset();
  await Router.push('/auth/sign-in');
};
