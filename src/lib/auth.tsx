import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import React from 'react';
import { useAuthContext } from 'src/context';

import { Router } from '../i18n';

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
