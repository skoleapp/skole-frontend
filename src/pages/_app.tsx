import 'nprogress/nprogress.css';
import 'typeface-roboto';

import { ApolloProvider } from '@apollo/react-hooks';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { UserMeDocument, UserObjectType } from 'generated/graphql';
import { IncomingMessage } from 'http';
import { ConfirmProvider } from 'material-ui-confirm';
import { NextPage } from 'next';
import App, { AppContext, AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import * as R from 'ramda';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ContextProvider } from '../context';
import { appWithTranslation } from '../i18n';
import { initApolloClient, pageView, PWAProvider } from '../lib';
import { GlobalStyle, theme } from '../styles';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeError', () => NProgress.done());

Router.events.on('routeChangeComplete', (url: string) => {
    NProgress.done();
    pageView(url);
});

interface Props extends AppProps {
    user: UserObjectType | null;
    isMobileGuess: boolean | null;
}

const SkoleApp = ({ Component, pageProps, isMobileGuess, user }: Props) => {
    const { t } = useTranslation();
    const apolloClient = initApolloClient();

    const initialContextProps = {
        user,
        isMobileGuess,
    };

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

SkoleApp.getInitialProps = async (appContext: AppContext): Promise<Props> => {
    const appProps = (await App.getInitialProps(appContext)) as AppProps;
    const apolloClient = initApolloClient(appContext.ctx);
    const userAgent = R.path(['ctx', 'req', 'headers', 'user-agent'], appContext) as string;
    let user = null;

    try {
        const { data } = await apolloClient.query({ query: UserMeDocument });
        user = data.userMe;
    } catch {
        user = null;
    }

    // We sniff the user agent in order to pre-populate the context value about the user's device.
    const isMobileGuess = !!userAgent
        ? !!userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i)
        : null;

    return { user, isMobileGuess, ...appProps };
};

export default appWithTranslation(SkoleApp);
