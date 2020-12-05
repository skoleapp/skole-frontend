import {
  ConfirmationDialog,
  LanguageSelectorDialog,
  Notifications,
  SettingsModal,
  ShareDialog,
} from 'components';
import {
  AuthContextProvider,
  LanguageContextProvider,
  NotificationsContextProvider,
  SettingsContextProvider,
  ConfirmContextProvider,
  ShareContextProvider,
} from 'context';
import { NextPage } from 'next';
import React from 'react';

// Provide common contexts for all pages. Used automatically in all pages through the auth HOC's.
export const withCommonContexts = (PageComponent: NextPage): NextPage => {
  const WithCommonContexts: NextPage = (pageProps) => (
    <AuthContextProvider>
      <LanguageContextProvider>
        <NotificationsContextProvider>
          <SettingsContextProvider>
            <ConfirmContextProvider>
              <ShareContextProvider>
                <PageComponent {...pageProps} />
                <ConfirmationDialog />
                <Notifications />
                <SettingsModal />
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
