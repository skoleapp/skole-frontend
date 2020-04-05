import cookie from 'js-cookie';
import { NextPage, NextPageContext } from 'next';
import nextCookie from 'next-cookies';
import Router from 'next/router';
import React, { useEffect } from 'react';

import { UserObjectType } from '../../generated/graphql';
import { includeDefaultNamespaces } from '../i18n';
import { I18nProps, SkoleContext } from '../types';

interface LoginProps {
    token: string;
    user: UserObjectType;
}

export const login = ({ token, user }: LoginProps): void => {
    cookie.set('token', token, { expires: 1 });
    window.localStorage.setItem('user', JSON.stringify(user));
};

export const logout = (): void => {
    cookie.remove('token');
    window.localStorage.setItem('logout', String(Date.now())); // Log out from all windows.
    Router.push('/login');
};

export const getUser = (): UserObjectType | null => {
    if (typeof window !== 'undefined') {
        return JSON.parse(window.localStorage.getItem('user') || '');
    } else {
        return null;
    }
};

export const auth = (ctx: NextPageContext): string | undefined => {
    const { token } = nextCookie(ctx);

    // If there's no token, it means the user is not logged in.
    if (!token) {
        if (typeof window === 'undefined') {
            ctx.res?.writeHead(302, { Location: '/login' });
            ctx.res?.end();
        } else {
            Router.push('/login');
        }
    }

    return token;
};

interface WrapperProps extends I18nProps {
    token: string | undefined;
}

export const withAuthSync = (WrappedComponent: NextPage): JSX.Element => {
    const Wrapper = (props: WrapperProps): JSX.Element => {
        const syncLogout = (e: StorageEvent): void => {
            if (e.key === 'logout') {
                Router.push('/login');
            }
        };

        useEffect(() => {
            window.addEventListener('storage', syncLogout);

            return (): void => {
                window.removeEventListener('storage', syncLogout);
                window.localStorage.removeItem('logout');
            };
        }, []);

        return <WrappedComponent {...(props as Omit<WrapperProps, 'token' | 'namespacesRequired'>)} />;
    };

    Wrapper.getInitialProps = async (ctx: SkoleContext): Promise<WrapperProps> => {
        const token = auth(ctx);
        const componentProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));
        const namespacesRequired = includeDefaultNamespaces([]);
        return { ...componentProps, token, namespacesRequired };
    };

    return (Wrapper as unknown) as JSX.Element;
};
