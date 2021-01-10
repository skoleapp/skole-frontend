import 'nprogress/nprogress.css';
import 'typeface-roboto';

import { ApolloProvider } from '@apollo/client';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { I18nProvider, useApollo } from 'lib';
import { AppProps } from 'next/app';
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import React, { useEffect } from 'react';
import { theme } from 'theme';
import DayJsUtils from '@date-io/dayjs';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeError', () => NProgress.done());
Router.events.on('routeChangeComplete', () => NProgress.done());

const SkoleApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const apolloClient = useApollo(pageProps.initialApolloState);
  const { locale } = useRouter();

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');

    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return (
    <I18nProvider lang={locale || ''} namespaces={pageProps._ns}>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={DayJsUtils}>
            <CssBaseline />
            <Component {...pageProps} />
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </ApolloProvider>
    </I18nProvider>
  );
};

export default SkoleApp;
