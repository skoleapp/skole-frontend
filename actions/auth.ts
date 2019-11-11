import ApolloClient from 'apollo-client';
import cookie from 'cookie';
import Router from 'next/router';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { UserMeDocument } from '../generated/graphql';
import { UserMe } from '../interfaces';
import {
  GET_USER_ME_ERROR,
  GET_USER_ME_LOADING,
  GET_USER_ME_SUCCESS,
  LOGIN,
  LOGOUT,
  UPDATE_USER_ME
} from './types';

interface LoginParams {
  client: ApolloClient<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  token: string;
  user: UserMe;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const clientLogin: any = ({ client, token, user }: LoginParams) => async (
  dispatch: Dispatch<AnyAction>
): Promise<void> => {
  document.cookie = cookie.serialize('token', token, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/'
  });

  dispatch({ type: LOGIN, payload: user });
  await client.cache.reset();
  Router.push('/account');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUserMe: any = (apolloClient: ApolloClient<any>) => async (
  dispatch: Dispatch<AnyAction>
): Promise<void> => {
  dispatch({ type: GET_USER_ME_LOADING });

  try {
    const { data } = await apolloClient.query({ query: UserMeDocument });
    dispatch({ type: GET_USER_ME_SUCCESS, payload: data.userMe });
  } catch (err) {
    dispatch({ type: GET_USER_ME_ERROR, payload: err });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateUserMe: any = (userMe: UserMe) => (dispatch: Dispatch<AnyAction>) => {
  dispatch({ type: UPDATE_USER_ME, payload: userMe });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logout: any = (apolloClient: ApolloClient<any>) => async (
  dispatch: Dispatch<AnyAction>
): Promise<void> => {
  document.cookie = cookie.serialize('token', '', {
    maxAge: -1,
    path: '/'
  });

  dispatch({ type: LOGOUT });
  await apolloClient.cache.reset();
  Router.push('/logout');
};
