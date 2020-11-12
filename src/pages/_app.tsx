import 'nprogress/nprogress.css';
import 'typeface-roboto';
import 'draft-js/dist/Draft.css';

import { ApolloProvider } from '@apollo/client';
import { CssBaseline, makeStyles, ThemeProvider } from '@material-ui/core';
import {
    AuthContextProvider,
    LanguageSelectorContextProvider,
    NotificationsContextProvider,
    SettingsContextProvider,
} from 'context';
import { I18nProvider, Trans, useApollo } from 'lib';
import { ConfirmOptions, ConfirmProvider } from 'material-ui-confirm';
import { AppProps } from 'next/app';
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import React, { useEffect } from 'react';
import { BORDER_RADIUS, theme } from 'theme';

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeError', () => NProgress.done());
Router.events.on('routeChangeComplete', () => NProgress.done());

const useStyles = makeStyles(({ spacing }) => ({
    confirmDialogPaper: {
        borderRadius: BORDER_RADIUS,
        padding: spacing(2),
    },
}));

const SkoleApp = ({ Component, pageProps }: AppProps): JSX.Element => {
    const apolloClient = useApollo(pageProps.initialApolloState);
    const { locale } = useRouter();
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
        // TODO: Place some of these context wrappers lower in the component tree.
        // The `locale` can be undefined according to Next.js typings but we assert that it will always be defined since the `I18nProvider` expects a string value.
        <I18nProvider lang={locale!} namespaces={pageProps._ns}>
            <ApolloProvider client={apolloClient}>
                <AuthContextProvider>
                    <LanguageSelectorContextProvider>
                        <NotificationsContextProvider>
                            <SettingsContextProvider>
                                <ThemeProvider theme={theme}>
                                    <ConfirmProvider defaultOptions={defaultConfirmOptions as ConfirmOptions}>
                                        <CssBaseline />
                                        <Component {...pageProps} />
                                    </ConfirmProvider>
                                </ThemeProvider>
                            </SettingsContextProvider>
                        </NotificationsContextProvider>
                    </LanguageSelectorContextProvider>
                </AuthContextProvider>
            </ApolloProvider>
        </I18nProvider>
    );
};

export default SkoleApp;
