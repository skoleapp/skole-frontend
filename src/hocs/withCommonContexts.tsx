import {
  ConfirmationDialog,
  LanguageSelectorDialog,
  Notifications,
  SettingsDialog,
  ShareDialog,
  ThreadFormDialog,
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
  ThreadFormContextProvider,
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
                    <ThreadFormContextProvider>
                      <PageComponent {...pageProps} />
                      <ConfirmationDialog />
                      <SettingsDialog />
                      <LanguageSelectorDialog />
                      <ShareDialog />
                      <ThreadFormDialog />
                      <Notifications />
                    </ThreadFormContextProvider>
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
