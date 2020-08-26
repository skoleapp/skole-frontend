import 'typeface-roboto';
import 'draft-js/dist/Draft.css';

import { ApolloProvider } from '@apollo/client';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import {
    AuthContextProvider,
    DiscussionContextProvider,
    LanguageSelectorContextProvider,
    NotificationsContextProvider,
    PDFViewerContextProvider,
    SettingsContextProvider,
} from 'context';
import { appWithTranslation, useApollo, useTranslation } from 'lib';
import { ConfirmProvider } from 'material-ui-confirm';
import { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import { theme } from 'styles';

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
