import 'nprogress/nprogress.css';
import 'typeface-roboto';

import { ApolloProvider } from '@apollo/client';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { ContextProvider } from 'context';
import { appWithTranslation, pageView, Router, useApollo, useTranslation } from 'lib';
import { ConfirmProvider } from 'material-ui-confirm';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import NProgress from 'nprogress';
import React, { useEffect } from 'react';
import { GlobalStyle, theme } from 'styles';

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeError', () => NProgress.done());

Router.events.on('routeChangeComplete', (url: string) => {
    NProgress.done();
    pageView(url);
});

const SkoleApp: NextPage<AppProps> = ({ Component, pageProps }) => {
    const { t } = useTranslation();
    const apolloClient = useApollo(pageProps.initialApolloState);

    const defaultConfirmOptions = {
        confirmationText: t('common:confirm'),
        cancellationText: t('common:cancel'),
    };

    useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');

        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }, []);

    return (
        <ApolloProvider client={apolloClient}>
            <ContextProvider>
                <ThemeProvider theme={theme}>
                    <ConfirmProvider defaultOptions={defaultConfirmOptions}>
                        <CssBaseline />
                        <GlobalStyle />
                        <Component {...pageProps} />
                    </ConfirmProvider>
                </ThemeProvider>
            </ContextProvider>
        </ApolloProvider>
    );
};

export default appWithTranslation(SkoleApp);
