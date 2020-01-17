import 'nprogress/nprogress.css';
import 'typeface-roboto';

import { GlobalStyle, theme } from '../styles';

import App from 'next/app';
import { CssBaseline } from '@material-ui/core';
import { I18nPage } from '../types';
import NProgress from 'nprogress';
import { NextPageContext } from 'next';
import React from 'react';
import Router from 'next/router';
import { ThemeProvider } from '@material-ui/styles';
import { appWithTranslation } from '../i18n';

interface Props {
    Component: I18nPage;
    pageProps: NextPageContext;
}

class SkoleApp extends App<Props> {
    componentDidMount(): void {
        const jssStyles = document.querySelector('#jss-server-side');

        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }

    render(): JSX.Element {
        const { Component, pageProps } = this.props;

        Router.events.on('routeChangeStart', () => NProgress.start());
        Router.events.on('routeChangeError', () => NProgress.done());
        Router.events.on('routeChangeComplete', () => {
            NProgress.done();
            window.scroll(0, 0);
        });

        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalStyle />
                <Component {...pageProps} />
            </ThemeProvider>
        );
    }
}

export default appWithTranslation(SkoleApp);
