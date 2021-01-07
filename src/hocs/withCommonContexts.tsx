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

// Provide common contexts for all pages. Used automatically in all pages through the auth HOC's.
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
                <Notifications />
                <SettingsDialog />
                <LanguageSelectorDialog />
                <ShareDialog />
              </ShareContextProvider>
            </ConfirmContextProvider>
          </SettingsContextProvider>
        </NotificationsContextProvider>
      </LanguageContextProvider>
    </AuthContextProvider>
  );

  return WithCommonContexts;
};
