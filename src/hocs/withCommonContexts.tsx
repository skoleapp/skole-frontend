import {
  AuthContextProvider,
  LanguageSelectorContextProvider,
  NotificationsContextProvider,
  SettingsContextProvider,
  ConfirmContextProvider,
} from 'context';
import { NextPage } from 'next';
import React from 'react';

// Provide common contexts for all pages. Used automatically in all pages through the auth HOC's.
export const withCommonContexts = (PageComponent: NextPage): NextPage => {
  const WithCommonContexts: NextPage = (pageProps) => (
    <AuthContextProvider>
      <LanguageSelectorContextProvider>
        <NotificationsContextProvider>
          <SettingsContextProvider>
            <ConfirmContextProvider>
              <PageComponent {...pageProps} />
            </ConfirmContextProvider>
          </SettingsContextProvider>
        </NotificationsContextProvider>
      </LanguageSelectorContextProvider>
    </AuthContextProvider>
  );

  return WithCommonContexts;
};
