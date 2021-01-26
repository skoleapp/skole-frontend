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
  LanguageContextProvider,
  NotificationsContextProvider,
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
                <PageComponent {...pageProps} />
                <ConfirmationDialog />
                <SettingsDialog />
                <LanguageSelectorDialog />
                <ShareDialog />
                <Notifications />
              </ShareContextProvider>
            </ConfirmContextProvider>
          </SettingsContextProvider>
        </NotificationsContextProvider>
      </LanguageContextProvider>
    </AuthContextProvider>
  );

  return WithCommonContexts;
};
