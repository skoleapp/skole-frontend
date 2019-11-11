import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { NextPage, NextPageContext } from 'next';
import App from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import React from 'react';
import { GlobalStyle, theme } from '../styles';

interface Props {
  Component: NextPage<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  pageProps: NextPageContext;
}

export default class SkoleApp extends App<Props> {
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
      window.scroll(0, 0);
      NProgress.done();
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
