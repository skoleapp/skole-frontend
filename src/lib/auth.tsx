import cookie from 'js-cookie';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import React from 'react';
import { useAuthContext } from 'src/context';

import { UserObjectType } from '../../generated/graphql';
import { Router } from '../i18n';
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

// Wrap all pages that require authentication with this.
export const withAuthSync = <T extends {}>(PageComponent: NextPage<T>): NextPage => {
    const WithAuthSync: NextPage = pageProps => {
        const { user, loading } = useAuthContext();
        const { pathname } = useRouter();

        const syncLogout = (e: StorageEvent): void => {
            if (e.key === 'logout') {
                Router.push('/login');
            }
        };

        useEffect(() => {
            window.addEventListener('storage', syncLogout);

            if (!user && !loading) {
                Router.push({ pathname: '/login', query: { next: pathname } });
            }

            return (): void => {
                window.removeEventListener('storage', syncLogout);
                window.localStorage.removeItem('logout');
            };
        }, [user, loading]);

        return <PageComponent {...(pageProps as T)} />;
    };

    return WithAuthSync;
};
