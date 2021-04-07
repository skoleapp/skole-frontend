import {
  ConfirmationDialog,
  LanguageSelectorDialog,
  Notifications,
  SettingsDialog,
  ShareDialog,
} from 'components';
import {
  AuthContextProvider,
  ConfirmContextProvider,
  InviteContextProvider,
  LanguageContextProvider,
  NotificationsContextProvider,
  OrderingContextProvider,
  SettingsContextProvider,
  ShareContextProvider,
} from 'context';
import { NextPage } from 'next';
import React from 'react';

export const withCommonContexts = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithCommonContexts: NextPage<T> = (pageProps: T) => (
    <AuthContextProvider>
      <LanguageContextProvider>
        <NotificationsContextProvider>
          <SettingsContextProvider>
            <ConfirmContextProvider>
              <ShareContextProvider>
                <OrderingContextProvider>
                  <InviteContextProvider>
                    <PageComponent {...pageProps} />
                    <ConfirmationDialog />
                    <SettingsDialog />
                    <LanguageSelectorDialog />
                    <ShareDialog />
                    <Notifications />
                  </InviteContextProvider>
                </OrderingContextProvider>
              </ShareContextProvider>
            </ConfirmContextProvider>
          </SettingsContextProvider>
        </NotificationsContextProvider>
      </LanguageContextProvider>
    </AuthContextProvider>
  );

  return WithCommonContexts;
};
