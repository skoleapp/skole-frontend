import ApolloClient from 'apollo-client';
import cookie from 'cookie';
import Router from 'next/router';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { UserDocument, UserMeDocument } from '../generated/graphql';
import { PublicUser, UserMe } from '../interfaces';
import { CLEAR_USER_ME, SET_USER_ME } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setUserMe: any = (userMe: UserMe) => (dispatch: Dispatch<AnyAction>): void =>
  dispatch({ type: SET_USER_ME, payload: userMe });

interface LoginParams {
  client: ApolloClient<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  token: string;
  user: UserMe;
}

export const login = ({ client, token, user }: LoginParams) => (
  dispatch: Dispatch<AnyAction>
): void => {
  document.cookie = cookie.serialize('token', token, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/'
  });

  dispatch(setUserMe(user));
  client.cache.reset().then(() => Router.push('/'));
};

interface UserMeObj {
  userMe: UserMe | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUserMe = async (apolloClient: ApolloClient<any>): Promise<UserMeObj> => {
  try {
    const { data } = await apolloClient.query({ query: UserMeDocument });
    return { userMe: data.userMe };
  } catch {
    return { userMe: null };
  }
};

interface PublicUserObj {
  user: PublicUser | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUser = async (
  id: string,
  apolloClient: ApolloClient<any>
): Promise<PublicUserObj> => {
  try {
    const { data } = await apolloClient.query({ variables: { id }, query: UserDocument });
    return { user: data.user };
  } catch {
    return { user: null };
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logout: any = (apolloClient: ApolloClient<any>) => (
  dispatch: Dispatch<AnyAction>
): void => {
  document.cookie = cookie.serialize('token', '', {
    maxAge: -1,
    path: '/'
  });

  dispatch({ type: CLEAR_USER_ME });
  apolloClient.cache.reset().then(() => Router.push('/logout'));
};
