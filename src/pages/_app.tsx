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
import React, { useEffect, useState } from 'react';
import { pageView } from 'src/lib';

import { appWithTranslation, includeDefaultNamespaces } from '../i18n';
import { breakpointsNum, GlobalStyle, theme } from '../styles';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeError', () => NProgress.done());

Router.events.on('routeChangeComplete', (url: string) => {
    NProgress.done();
    pageView(url);
});

interface SkoleAppProps extends AppProps {
    onMobileGuess: boolean;
}

const SkoleApp = ({ Component, pageProps, onMobileGuess }: SkoleAppProps): JSX.Element => {
    const [isMobile, setIsMobile] = useState(onMobileGuess);

    useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }

        const onMobile = window.innerWidth < breakpointsNum.MD;
        if (onMobile !== onMobileGuess) {
            setIsMobile(onMobile);
        }

        const resizeFunctionRef = (): void => {
            setIsMobile(window.innerWidth < breakpointsNum.MD);
        };
        window.addEventListener('resize', resizeFunctionRef);
        return (): void => window.removeEventListener('resize', resizeFunctionRef);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <ConfirmProvider>
                <CssBaseline />
                <GlobalStyle />
                <Component {...pageProps} isMobile={isMobile} />
            </ConfirmProvider>
        </ThemeProvider>
    );
};

SkoleApp.getInitialProps = async (ctx: AppContextType<Router>): Promise<{}> => {
    const pageProps = await NextApp.getInitialProps(ctx);

    let onMobileGuess;
    let userAgent;
    const { ctx: NextPageContext } = ctx;
    if (!!NextPageContext.req) {
        // if you are on the server and you get a 'req' property from your context
        userAgent = NextPageContext.req.headers['user-agent']; // get the user-agent from the headers
    } else {
        userAgent = navigator.userAgent; // if you are on the client you can access the navigator from the window object
    }
    if (!!userAgent) {
        onMobileGuess = Boolean(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i));
    }

    return { ...pageProps, namespaces: includeDefaultNamespaces([]), onMobileGuess };
};

export default appWithTranslation(SkoleApp);
