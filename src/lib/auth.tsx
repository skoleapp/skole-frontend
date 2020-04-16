import cookie from 'js-cookie';
import { GetServerSideProps, NextPage } from 'next';
import nextCookie from 'next-cookies';
import Router from 'next/router';
import { useEffect } from 'react';
import React from 'react';
import { useAuthContext } from 'src/context';

import { UserObjectType } from '../../generated/graphql';
import { AuthContext } from '../types';

interface UseAuth extends AuthContext {
    login: (token: string, user: UserObjectType) => void;
    logout: () => void;
}

export const useAuth = (): UseAuth => {
    const { setUser, ...authContext } = useAuthContext();

    const login = (token: string, user: UserObjectType): void => {
        cookie.set('token', token, { expires: 1 }); // One month.
        setUser(user);
    };

    const logout = (): void => {
        cookie.remove('token');
        localStorage.setItem('logout', String(Date.now())); // Log out from all windows.
        setUser(null);
        Router.push('/login');
    };

    return { ...authContext, setUser, login, logout };
};

// Wrap `getServerSideProps` with this for all pages that require authentication.
export const requireAuth = (getServerSidePropsInner: GetServerSideProps): GetServerSideProps => {
    const getServerSideProps: GetServerSideProps = async ctx => {
        const token = nextCookie(ctx);

        // If there's no token, it means the user is not logged in.
        if (!token) {
            ctx.res?.writeHead(302, { Location: '/login' });
            ctx.res?.end();
        }

        return await getServerSidePropsInner(ctx);
    };

    return getServerSideProps;
};

// Wrap all pages that require authentication with this.
export const withAuthSync = <T extends {}>(PageComponent: NextPage<T>): NextPage => {
    const WithAuthSync: NextPage = pageProps => {
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

        return <PageComponent {...(pageProps as T)} />;
    };

    return WithAuthSync;
};
