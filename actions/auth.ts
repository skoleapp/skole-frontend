import ApolloClient from 'apollo-client';
import cookie from 'cookie';
import Router from 'next/router';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { UserDocument, UserMeDocument } from '../generated/graphql';
import { User } from '../interfaces';
import { CLEAR_USER_ME, SET_USER_ME } from './types';

// eslint-disable-next-line
export const setUserMe: any = (userMe: User) => (dispatch: Dispatch<AnyAction>): void =>
  dispatch({ type: SET_USER_ME, payload: userMe });

interface LoginParams {
  client: ApolloClient<any>; // eslint-disable-line
  token: string;
  user: User;
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

interface UserMe {
  userMe: User | null;
}

// eslint-disable-next-line
export const getUserMe = async (apolloClient: ApolloClient<any>): Promise<UserMe> => {
  try {
    const { data } = await apolloClient.query({ query: UserMeDocument });
    return { userMe: data.user };
  } catch {
    return { userMe: null };
  }
};

interface PublicUser {
  user: User | null;
}

// eslint-disable-next-line
export const getUser = async (id: number, apolloClient: ApolloClient<any>): Promise<PublicUser> => {
  try {
    const { data } = await apolloClient.query({ variables: { id }, query: UserDocument });
    return { user: data.user };
  } catch {
    return { user: null };
  }
};

// eslint-disable-next-line
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
