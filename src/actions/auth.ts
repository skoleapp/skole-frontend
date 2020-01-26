import ApolloClient from 'apollo-client';
import cookie from 'cookie';
import Router from 'next/router';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';

import { SignInMutationPayload, UserObjectType } from '../../generated/graphql';
import { i18n } from '../i18n';
import { toggleNotification } from './ui';

export const AUTHENTICATE = 'AUTHENTICATED';
export const RE_AUTHENTICATE = 'RE_AUTHENTICATED';
export const DE_AUTHENTICATE = 'DE_AUTHENTICATED';

export const authenticate = (client: ApolloClient<{}>, { token, user }: SignInMutationPayload) => (
    dispatch: Dispatch<AnyAction>,
): void => {
    if (token && user) {
        document.cookie = cookie.serialize('token', token, {
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
        });

        dispatch({ type: AUTHENTICATE, payload: user });
        client.cache.reset();
    }
};

export const reAuthenticate = (user: UserObjectType) => (dispatch: Dispatch<AnyAction>): void => {
    dispatch({ type: RE_AUTHENTICATE, payload: user });
};

export const deAuthenticate = (apolloClient: ApolloClient<{}>) => async (
    dispatch: Dispatch<AnyAction>,
): Promise<void> => {
    document.cookie = cookie.serialize('token', '', {
        maxAge: -1,
        path: '/',
    });

    dispatch({ type: DE_AUTHENTICATE });
    dispatch((toggleNotification(i18n.t('notifications:signedOut')) as unknown) as AnyAction);
    await apolloClient.cache.reset();
    Router.push('/sign-in');
};
