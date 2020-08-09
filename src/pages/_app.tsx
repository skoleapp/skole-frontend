import 'nprogress/nprogress.css';
import 'typeface-roboto';
import 'draft-js/dist/Draft.css';

import { ApolloProvider } from '@apollo/client';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import {
    AuthContextProvider,
    DiscussionContextProvider,
    LanguageSelectorContextProvider,
    NotificationsContextProvider,
    PDFViewerContextProvider,
    SettingsContextProvider,
} from 'context';
import { appWithTranslation, pageView, Router, useApollo, useTranslation } from 'lib';
import { ConfirmProvider } from 'material-ui-confirm';
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

const SkoleApp = ({ Component, pageProps }: AppProps): JSX.Element => {
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
            <AuthContextProvider>
                <LanguageSelectorContextProvider>
                    <NotificationsContextProvider>
                        <SettingsContextProvider>
                            <DiscussionContextProvider>
                                <PDFViewerContextProvider>
                                    <ThemeProvider theme={theme}>
                                        <ConfirmProvider defaultOptions={defaultConfirmOptions}>
                                            <CssBaseline />
                                            <GlobalStyle />
                                            <Component {...pageProps} />
                                        </ConfirmProvider>
                                    </ThemeProvider>
                                </PDFViewerContextProvider>
                            </DiscussionContextProvider>
                        </SettingsContextProvider>
                    </NotificationsContextProvider>
                </LanguageSelectorContextProvider>
            </AuthContextProvider>
        </ApolloProvider>
    );
};

export default appWithTranslation(SkoleApp);
