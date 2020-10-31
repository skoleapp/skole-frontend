import 'typeface-roboto';
import 'draft-js/dist/Draft.css';

import { ApolloProvider } from '@apollo/client';
import { CssBaseline, makeStyles, ThemeProvider } from '@material-ui/core';
import { PageTransition } from 'components';
import {
    AuthContextProvider,
    DiscussionContextProvider,
    LanguageSelectorContextProvider,
    NotificationsContextProvider,
    PDFViewerContextProvider,
    SettingsContextProvider,
} from 'context';
import { Trans, useApollo } from 'lib';
import { ConfirmOptions, ConfirmProvider } from 'material-ui-confirm';
import App, { AppContext, AppProps } from 'next/app';
import React, { useEffect } from 'react';
import { BORDER_RADIUS, theme } from 'theme';

const useStyles = makeStyles(({ spacing }) => ({
    confirmDialogPaper: {
        borderRadius: BORDER_RADIUS,
        padding: spacing(2),
    },
}));

const SkoleApp = ({ Component, pageProps }: AppProps): JSX.Element => {
    const apolloClient = useApollo(pageProps.initialApolloState);
    const classes = useStyles();

    const defaultConfirmOptions = {
        confirmationText: <Trans i18nKey="common:confirm" />, // TODO: Check that this works.
        cancellationText: <Trans i18nKey="common:cancel" />, // TODO: Check that this works.
        dialogProps: {
            fullScreen: false,
            fullWidth: true,
            classes: {
                paper: classes.confirmDialogPaper,
            },
        },
        confirmationButtonProps: {
            fullWidth: true,
        },
        cancellationButtonProps: {
            fullWidth: true,
        },
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
                                        <ConfirmProvider defaultOptions={defaultConfirmOptions as ConfirmOptions}>
                                            <CssBaseline />
                                            <PageTransition>
                                                <Component {...pageProps} />
                                            </PageTransition>
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

SkoleApp.getInitialProps = async (appContext: AppContext): Promise<{}> => ({
    ...(await App.getInitialProps(appContext)),
});

export default SkoleApp;
