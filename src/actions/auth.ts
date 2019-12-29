import ApolloClient from 'apollo-client';
import cookie from 'cookie';
import Router from 'next/router';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { i18n } from '../i18n';
import { User } from '../types';
import { openNotification } from './notifications';

export const AUTHENTICATE = 'AUTHENTICATED';
export const RE_AUTHENTICATE = 'REAUTHENTICATED';
export const DE_AUTHENTICATE = 'DEAUTHENTICATED';

interface SignInParams {
    client: ApolloClient<any>;
    token: string;
    user: User;
}

export const authenticate = ({ client, token, user }: SignInParams) => async (
    dispatch: Dispatch<AnyAction>,
): Promise<void> => {
    document.cookie = cookie.serialize('token', token, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
    });

    dispatch({ type: AUTHENTICATE, payload: user });
    await client.cache.reset();
    await Router.push('/profile');
};

export const reAuthenticate = (userMe: User) => (dispatch: Dispatch<AnyAction>): void => {
    dispatch({ type: RE_AUTHENTICATE, payload: userMe });
};

export const deAuthenticate = (apolloClient: ApolloClient<{}>) => async (
    dispatch: Dispatch<AnyAction>,
): Promise<void> => {
    document.cookie = cookie.serialize('token', '', {
        maxAge: -1,
        path: '/',
    });

    dispatch({ type: DE_AUTHENTICATE });
    dispatch(openNotification(i18n.t('notifications:signedOut')));
    await apolloClient.cache.reset();
    Router.push('/auth/sign-in');
};
