import 'nprogress/nprogress.css';
import 'typeface-roboto';

import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { ConfirmProvider } from 'material-ui-confirm';
import { NextPageContext } from 'next';
import App from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import React from 'react';

import { appWithTranslation } from '../i18n';
import { GlobalStyle, theme } from '../styles';
import { I18nPage } from '../types';

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
                <ConfirmProvider>
                    <CssBaseline />
                    <GlobalStyle />
                    <Component {...pageProps} />
                </ConfirmProvider>
            </ThemeProvider>
        );
    }
}

export default appWithTranslation(SkoleApp);
