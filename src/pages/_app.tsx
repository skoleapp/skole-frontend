import 'nprogress/nprogress.css';
import 'typeface-roboto';
import 'ol/ol.css';

import { ApolloProvider } from '@apollo/react-hooks';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { UserMeDocument, UserObjectType } from 'generated/graphql';
import { ConfirmProvider } from 'material-ui-confirm';
import App, { AppContext, AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import * as R from 'ramda';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ContextProvider } from '../context';
import { appWithTranslation } from '../i18n';
import { initApolloClient, initOnContext, pageView, PWAProvider } from '../lib';
import { GlobalStyle, theme } from '../styles';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeError', () => NProgress.done());

Router.events.on('routeChangeComplete', (url: string) => {
    NProgress.done();
    pageView(url);
});

interface Props extends AppProps {
    apolloClient?: ApolloClient<NormalizedCacheObject> | null;
    apolloState?: NormalizedCacheObject;
    isMobileGuess: boolean | null;
    user: UserObjectType | null;
}

const SkoleApp = ({ Component, apolloClient, apolloState, pageProps, isMobileGuess, user }: Props): JSX.Element => {
    const { t } = useTranslation();
    const client = apolloClient || initApolloClient(apolloState, undefined);
    const initialContextProps = { user, isMobileGuess };

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
        <ApolloProvider client={client}>
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

SkoleApp.getInitialProps = async (ctx: AppContext): Promise<Props> => {
    const { apolloClient } = initOnContext(ctx.ctx);
    const pageProps = (await App.getInitialProps(ctx)) as AppProps;
    const userAgent = R.path(['ctx', 'req', 'headers', 'user-agent'], ctx) as string;
    let user = null;

    try {
        const { data } = await apolloClient.query({ query: UserMeDocument });
        user = data.userMe;
    } catch {
        user = null;
    }

    // We sniff the user agent in order to pre-populate the context value about the user's device.
    const isMobileGuess = !!userAgent
        ? !!userAgent.match('/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i')
        : null;

    return { ...pageProps, isMobileGuess, user };
};

export default appWithTranslation(SkoleApp);
