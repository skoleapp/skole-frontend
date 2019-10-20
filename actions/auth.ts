import ApolloClient from 'apollo-client';
import cookie from 'cookie';
import Router from 'next/router';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { UserDocument, UserMeDocument } from '../generated/graphql';
import { User } from '../interfaces';
import { LOGOUT, SET_USER } from './types';

interface LoginParams {
  client: ApolloClient<any>;
  token: string;
  user: User;
}

export const login = ({ client, token, user }: LoginParams) => (
  dispatch: Dispatch<AnyAction>
): void => {
  // Store the token in cookie.
  document.cookie = cookie.serialize('token', token, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/' // Make cookie available for all routes underneath "/".
  });

  dispatch({ type: SET_USER, payload: { ...user } });

  // Force a reload of all the current queries now that the user is logged in.
  client.cache.reset().then(() => Router.push('/'));
};

export const getUserMe: any = (apolloClient: ApolloClient<any>) => async (
  dispatch: Dispatch<AnyAction>
) => {
  try {
    const { data } = await apolloClient.query({ query: UserMeDocument });
    const { userMe } = data;

    if (userMe) {
      dispatch({ type: SET_USER, payload: { ...userMe } });
    }

    return { userMe };
  } catch {
    return { userMe: null };
  }
};

export const getUser = async (id: number, apolloClient: ApolloClient<any>) => {
  try {
    const { data } = await apolloClient.query({
      variables: { id },
      query: UserDocument
    });

    return { user: data.user };
  } catch {
    return { user: null };
  }
};

export const logout: any = (apolloClient: ApolloClient<any>) => (dispatch: Dispatch<AnyAction>) => {
  dispatch({ type: LOGOUT }); // Clear store.

  document.cookie = cookie.serialize('token', '', {
    maxAge: -1, // Expire the cookie immediately
    path: '/' // Make cookie available for all routes underneath "/".
  });

  // Force a reload of all the current queries.
  apolloClient.cache.reset().then(() => Router.push('/logout'));
};
