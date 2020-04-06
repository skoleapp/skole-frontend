import 'nprogress/nprogress.css';
import 'typeface-roboto';
import 'ol/ol.css';

import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { ConfirmProvider } from 'material-ui-confirm';
import NextApp from 'next/app';
import { AppContextType } from 'next/dist/next-server/lib/utils';
import { Router } from 'next/router';
import NProgress from 'nprogress';
import React, { useEffect } from 'react';

import { appWithTranslation } from '../i18n';
import { GlobalStyle, theme } from '../styles';

const SkoleApp = ({ Component, pageProps }): JSX.Element => {
    useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');

        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }, []);

    Router.events.on('routeChangeStart', () => NProgress.start());
    Router.events.on('routeChangeError', () => NProgress.done());
    Router.events.on('routeChangeComplete', () => NProgress.done());

    return (
        <ThemeProvider theme={theme}>
            <ConfirmProvider>
                <CssBaseline />
                <GlobalStyle />
                <Component {...pageProps} />
            </ConfirmProvider>
        </ThemeProvider>
    );
};

SkoleApp.getInitialProps = async (ctx: AppContextType<Router>): Promise<{}> => {
    const pageProps = await NextApp.getInitialProps(ctx);
    return { ...pageProps };
};

export default appWithTranslation(SkoleApp);
