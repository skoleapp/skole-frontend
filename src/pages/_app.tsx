import 'nprogress/nprogress.css';

import { ApolloProvider } from '@apollo/client';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { HistoryContextProvider } from 'context';
import { withDarkMode, withScrolling } from 'hocs';
import { useMuiTheme } from 'hooks';
import i18nConfig from 'i18n';
import { appWithI18n, I18nProvider, useApollo } from 'lib';
import { AppProps } from 'next/app';
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import * as R from 'ramda';
import React, { useEffect } from 'react';

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeError', () => NProgress.done());
Router.events.on('routeChangeComplete', () => NProgress.done());

const SkoleApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const { locale } = useRouter();
  const apolloClient = useApollo(pageProps.initialApolloState);
  const theme = useMuiTheme();

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');

    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return (
    <HistoryContextProvider>
      <I18nProvider lang={locale || ''} namespaces={pageProps._ns}>
        <ApolloProvider client={apolloClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </ApolloProvider>
      </I18nProvider>
    </HistoryContextProvider>
  );
};

const withWrappers = R.compose(withDarkMode, withScrolling);

// Ignore: The `appWithI18n` types are missing the `pageProps` object.
// @ts-ignore
export default appWithI18n(withWrappers(SkoleApp), {
  ...i18nConfig,
  skipInitialProps: true, // Enable automatic static page optimization.
});
