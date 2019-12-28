import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { NextPageContext } from 'next';
import App from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
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
        <CssBaseline />
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }
}

export default appWithTranslation(SkoleApp);
