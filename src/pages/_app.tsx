import 'nprogress/nprogress.css';
import 'typeface-roboto';
import 'ol/ol.css';

import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { ConfirmProvider } from 'material-ui-confirm';
import { NextPage } from 'next';
import NextApp from 'next/app';
import { AppContextType } from 'next/dist/next-server/lib/utils';
import { Router } from 'next/router';
import NProgress from 'nprogress';
import React, { useEffect } from 'react';
import { setDevice } from 'src/actions';
import { pageView } from 'src/lib';
import { breakpointsNum } from 'src/styles';
import { useBreakPoint } from 'src/utils';

import { appWithTranslation, includeDefaultNamespaces } from '../i18n';
import { GlobalStyle, theme } from '../styles';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeError', () => NProgress.done());

Router.events.on('routeChangeComplete', (url: string) => {
    NProgress.done();
    pageView(url);
});

interface Props {
    Component: NextPage;
    pageProps: {};
}

const SkoleApp = ({ Component, pageProps }: Props): JSX.Element => {
    useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }, []);
    setDevice(useBreakPoint(breakpointsNum.MD));

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
    return { ...pageProps, namespaces: includeDefaultNamespaces([]) };
};

export default appWithTranslation(SkoleApp);
