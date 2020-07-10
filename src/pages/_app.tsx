import 'nprogress/nprogress.css';
import 'typeface-roboto';

import { ApolloProvider } from '@apollo/react-hooks';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ContextProvider } from 'context';
import { UserObjectType } from 'generated/graphql';
import { appWithTranslation } from 'i18n';
import { pageView, PWAProvider, useApollo } from 'lib';
import { ConfirmProvider } from 'material-ui-confirm';
import { AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobalStyle, theme } from 'styles';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeError', () => NProgress.done());

Router.events.on('routeChangeComplete', (url: string) => {
    NProgress.done();
    pageView(url);
});

interface Props extends AppProps {
    user: UserObjectType | null;
    isMobileGuess: boolean | null;
    initialApolloState: NormalizedCacheObject;
}

const SkoleApp = ({ Component, pageProps }: Props): JSX.Element => {
    const { t } = useTranslation();
    const { initialApolloState, isMobileGuess, user } = pageProps;
    const initialContextProps = { user, isMobileGuess };
    const apolloClient = useApollo(initialApolloState);

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
            <ContextProvider {...initialContextProps}>
                <ThemeProvider theme={theme}>
                    <ConfirmProvider defaultOptions={defaultConfirmOptions}>
                        <PWAProvider>
                            <CssBaseline />
                            <GlobalStyle />
                            <Component {...pageProps} />
                        </PWAProvider>
                    </ConfirmProvider>
                </ThemeProvider>
            </ContextProvider>
        </ApolloProvider>
    );
};

export default appWithTranslation(SkoleApp);
