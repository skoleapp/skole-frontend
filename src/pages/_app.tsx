import 'nprogress/nprogress.css';
import 'typeface-roboto';
import 'ol/ol.css';

import { ApolloProvider, useQuery } from '@apollo/react-hooks';
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

import { ContextProvider } from '../context';
import { appWithTranslation } from '../i18n';
import { initApolloClient, pageView } from '../lib';
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
}

const SkoleApp = ({ Component, apolloClient, apolloState, pageProps, isMobileGuess }: Props): JSX.Element => {
    const client = apolloClient || initApolloClient(apolloState, undefined);
    const { data, loading } = useQuery(UserMeDocument, { client });

    useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');

        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }, []);

    const initialContextProps = {
        initialAuthState: { user: R.propOr(null, 'userMe', data) as UserObjectType | null, loading },
        isMobileGuess,
    };

    return (
        <ApolloProvider client={client}>
            <ContextProvider {...initialContextProps}>
                <ThemeProvider theme={theme}>
                    <ConfirmProvider>
                        <CssBaseline />
                        <GlobalStyle />
                        <Component {...pageProps} />
                    </ConfirmProvider>
                </ThemeProvider>
            </ContextProvider>
        </ApolloProvider>
    );
};

SkoleApp.getInitialProps = async (ctx: AppContext): Promise<Props> => {
    const userAgent = R.path(['ctx', 'req', 'headers', 'user-agent'], ctx) as string;

    // We sniff the user agent in order to pre-populate the context value about the user's device.
    const isMobileGuess = !!userAgent
        ? !!userAgent.match('/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i')
        : null;

    const appProps = (await App.getInitialProps(ctx)) as AppProps;
    return { ...appProps, isMobileGuess };
};

export default appWithTranslation(SkoleApp);
