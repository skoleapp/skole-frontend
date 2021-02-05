import { DarkModeContextProvider } from 'context';
import { NextPage } from 'next';
import React from 'react';

export const withDarkMode = (PageComponent: NextPage): NextPage => {
  const WithDarkMode: NextPage = (pageProps) => (
    <DarkModeContextProvider>
      <PageComponent {...pageProps} />
    </DarkModeContextProvider>
  );

  return WithDarkMode;
};
