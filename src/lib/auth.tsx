import cookie from 'js-cookie';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import React from 'react';
import { useAuthContext } from 'src/context';

import { Router } from '../i18n';

export const clientLogin = (token: string): string | undefined => cookie.set('token', token, { expires: 1 }); // One month.

export const clientLogout = async (): Promise<void> => {
    cookie.remove('token');
    localStorage.setItem('logout', String(Date.now())); // Log out from all windows.
};

// Wrap all pages that require authentication with this.
export const withAuthSync = <T extends {}>(PageComponent: NextPage<T>): NextPage => {
    const WithAuthSync: NextPage = pageProps => {
        const { user } = useAuthContext();
        const { asPath } = useRouter();

        const syncLogout = (e: StorageEvent): void => {
            if (e.key === 'logout') {
                Router.push('/login');
            }
        };

        useEffect(() => {
            window.addEventListener('storage', syncLogout);

            // Redirect in case of authentication fail.
            if (!user) {
                Router.push({ pathname: '/login', query: { next: asPath } });
            }

            return (): void => {
                window.removeEventListener('storage', syncLogout);
                window.localStorage.removeItem('logout');
            };
        }, [user]);

        return <PageComponent {...(pageProps as T)} />;
    };

    return WithAuthSync;
};
