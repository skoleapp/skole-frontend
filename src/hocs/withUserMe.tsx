import { ErrorTemplate, LoadingTemplate } from 'components';
import { useAuthContext } from 'context';
import { useMarkActivityAsReadMutation, useRegisterFcmTokenMutation } from 'generated';
import { useLanguageHeaderContext, useUserMe } from 'hooks';
import { NextPage } from 'next';
import Router from 'next/router';
import React, { useCallback, useEffect } from 'react';
import { LS_LOGOUT_KEY, postMessageWebView, urls } from 'utils';

import { withCommonContexts } from './withCommonContexts';

export const withUserMe = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithUserMe: NextPage<T> = (pageProps: T) => {
    const { authLoading, authNetworkError } = useUserMe();
    const { fcmTokens } = useAuthContext();
    const context = useLanguageHeaderContext();
    const [registerFcmToken] = useRegisterFcmTokenMutation({ context });
    const [markSingleActivityRead] = useMarkActivityAsReadMutation({ context });

    // Handle incoming `postMessage` events.
    const messageHandler = useCallback(
      async ({ data }: WebViewMessage): Promise<void> => {
        let json;
        try {
          json = JSON.parse(data);
        } catch {
          return;
        }

        const { key } = json;

        switch (key) {
          case 'REGISTER_FCM_TOKEN': {
            const { token } = json;

            if (!fcmTokens.includes(token)) {
              await registerFcmToken({ variables: { token } });
            }

            break;
          }

          // Set activity as read and navigate to the correct page.
          case 'NOTIFICATION_OPENED': {
            const {
              data: { activity: id, thread, comment, user },
            } = json;

            let pathname;
            let query;

            if (thread) {
              pathname = urls.thread(thread);
            } else if (user) {
              pathname = urls.user(user);
            }

            if (comment) {
              query = { comment };
            }

            if (id) {
              await markSingleActivityRead({ variables: { id, read: true } });
            }

            if (pathname) {
              await Router.push({ pathname, query });
            }

            break;
          }

          default: {
            break;
          }
        }
      },
      [fcmTokens, registerFcmToken, markSingleActivityRead],
    );

    useEffect(() => {
      window.addEventListener('message', messageHandler); // iOS.
      document.addEventListener('message', (messageHandler as unknown) as EventListener); // Android

      return (): void => {
        window.removeEventListener('message', messageHandler);
        document.removeEventListener('message', (messageHandler as unknown) as EventListener);
      };
    }, [messageHandler]);

    const syncLogout = (e: StorageEvent): false | Promise<boolean> =>
      e.key === LS_LOGOUT_KEY && Router.push(urls.logout);

    useEffect(() => {
      postMessageWebView('GET_FCM_TOKEN');
      window.addEventListener('storage', syncLogout);

      return (): void => {
        window.removeEventListener('storage', syncLogout);
        localStorage.removeItem(LS_LOGOUT_KEY);
      };
    }, []);

    if (authNetworkError) {
      return <ErrorTemplate variant="offline" />;
    }

    if (authLoading && typeof window !== 'undefined') {
      return <LoadingTemplate />;
    }

    return <PageComponent {...pageProps} />;
  };

  return withCommonContexts(WithUserMe);
};
