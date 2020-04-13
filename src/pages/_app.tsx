import 'nprogress/nprogress.css';
import 'typeface-roboto';
import 'ol/ol.css';

import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { ConfirmProvider } from 'material-ui-confirm';
import NextApp, { AppProps } from 'next/app';
import { AppContextType } from 'next/dist/next-server/lib/utils';
import { Router } from 'next/router';
import NProgress from 'nprogress';
import React, { useEffect } from 'react';

import { ContextProvider } from '../context';
import { appWithTranslation, includeDefaultNamespaces } from '../i18n';
import { pageView } from '../lib';
import { GlobalStyle, theme } from '../styles';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeError', () => NProgress.done());

Router.events.on('routeChangeComplete', (url: string) => {
    NProgress.done();
    pageView(url);
});

const SkoleApp = ({ Component, pageProps }: AppProps): JSX.Element => {
    useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');

        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <ContextProvider>
                <ConfirmProvider>
                    <CssBaseline />
                    <GlobalStyle />
                    <Component {...pageProps} />
                </ConfirmProvider>
            </ContextProvider>
        </ThemeProvider>
    );
};

SkoleApp.getInitialProps = async (ctx: AppContextType<Router>): Promise<{}> => {
    const pageProps = await NextApp.getInitialProps(ctx);
    return { ...pageProps, namespaces: includeDefaultNamespaces([]) };
};

export default appWithTranslation(SkoleApp);
