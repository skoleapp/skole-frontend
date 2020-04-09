import cookie from 'js-cookie';
import { NextPage, NextPageContext } from 'next';
import nextCookie from 'next-cookies';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useApolloClient } from 'react-apollo';

import { UserMeDocument, UserObjectType } from '../../generated/graphql';
import { SkoleContext } from '../types';

interface UseAuth {
    user: UserObjectType | null;
    loading: boolean;
    updateUser: (user: UserObjectType | null) => void;
    login: (token: string, user: UserObjectType) => void;
    logout: () => void;
}

export const useAuth = (): UseAuth => {
    const [user, setUser] = useState<UserObjectType | null>(null);
    const [loading, setLoading] = useState(true);
    const apolloClient = useApolloClient();

    const updateUser = (user: UserObjectType | null): void => {
        localStorage.setItem('user', JSON.stringify(user));
        !!user && cookie.set('user-valid', 'true', { expires: (1 / 24) * (25 / 60) }); // ~ 25 minutes.
        setUser(user);
    };

    const refreshUser = async (): Promise<void> => {
        try {
            const { data } = await apolloClient.query({ query: UserMeDocument });
            updateUser(data.userMe);
        } catch {
            updateUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Periodically refresh user when loading pages.
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!cookie.get('user-valid')) {
                refreshUser();
            } else {
                setUser(JSON.parse(localStorage.getItem('user') || 'null'));
                setLoading(false);
            }
        }
    }, []);

    const login = (token: string, user: UserObjectType): void => {
        cookie.set('token', token, { expires: 1 });
        updateUser(user);
    };

    const logout = (): void => {
        cookie.remove('token');
        localStorage.setItem('logout', String(Date.now())); // Log out from all windows.
        updateUser(null);
        Router.push('/login');
    };

    return { user, loading, updateUser, login, logout };
};

export const auth = (ctx: NextPageContext): string | undefined => {
    const { token } = nextCookie(ctx);

    // If there's no token, it means the user is not logged in.
    if (!token) {
        if (typeof window === 'undefined') {
            ctx.res?.writeHead(302, { Location: '/login' });
            ctx.res?.end();
        } else {
            Router.push({ pathname: '/login', query: { next: ctx.pathname } });
        }
    }

    return token;
};

interface WrapperProps {
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
        return { ...componentProps, token };
    };

    return (Wrapper as unknown) as JSX.Element;
};
