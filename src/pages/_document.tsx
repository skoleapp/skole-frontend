import { ServerStyleSheets } from '@material-ui/styles';
import { DocumentInitialProps, RenderPageResult } from 'next/dist/next-server/lib/utils';
import Document, { DocumentContext, Head, Main, NextScript } from 'next/document';
import React from 'react';
import { ServerStyleSheet } from 'styled-components';

const GAScript = {
    __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments)}
        gtag("js", new Date());
        gtag("config", "UA-159917631-1");
    `,
};

export default class SkoleDocument extends Document {
    render(): JSX.Element {
        return (
            <html lang="en">
                <Head>
                    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-159917631-1"></script>
                    <script dangerouslySetInnerHTML={GAScript} />
                    <meta charSet="UTF-8" />
                    <meta
                        name="viewport"
                        content="viewport-fit=cover initial-scale=1, height=device-height, width=device-width"
                    />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="default"></meta>
                    <link rel="manifest" href="/manifest.json" />
                    <link rel="shortcut icon" href="/images/favicon.ico" />
                    <link rel="apple-touch-icon" sizes="180x180" href="/images/icons/icon-180x180.png" />
                    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ad3636"></link>
                    <link
                        href="/images/splashscreens/iphone5_splash.png"
                        media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2 and (orientation: portrait)"
                        rel="apple-touch-startup-image"
                    />
                    <link
                        href="/images/splashscreens/iphone6_splash.png"
                        media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2 and (orientation: portrait)"
                        rel="apple-touch-startup-image"
                    />
                    <link
                        href="/images/splashscreens/iphoneplus_splash.png"
                        media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3 and (orientation: portrait)"
                        rel="apple-touch-startup-image"
                    />
                    <link
                        href="/images/splashscreens/iphonex_splash.png"
                        media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3 and (orientation: portrait)"
                        rel="apple-touch-startup-image"
                    />
                    <link
                        href="/images/splashscreens/iphonexr_splash.png"
                        media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2 and (orientation: portrait)"
                        rel="apple-touch-startup-image"
                    />
                    <link
                        href="/images/splashscreens/iphonexsmax_splash.png"
                        media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3 and (orientation: portrait)"
                        rel="apple-touch-startup-image"
                    />
                    <link
                        href="/images/splashscreens/ipad_splash.png"
                        media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2 and (orientation: portrait)"
                        rel="apple-touch-startup-image"
                    />
                    <link
                        href="/images/splashscreens/ipadpro1_splash.png"
                        media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2 and (orientation: portrait)"
                        rel="apple-touch-startup-image"
                    />
                    <link
                        href="/images/splashscreens/ipadpro3_splash.png"
                        media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2 and (orientation: portrait)"
                        rel="apple-touch-startup-image"
                    />
                    <link
                        href="/images/splashscreens/ipadpro2_splash.png"
                        media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2 and (orientation: portrait)"
                        rel="apple-touch-startup-image"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}

SkoleDocument.getInitialProps = async (ctx: DocumentContext): Promise<DocumentInitialProps> => {
    const styledComponentsSheet = new ServerStyleSheet();
    const materialSheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = (): RenderPageResult | Promise<RenderPageResult> => {
        return originalRenderPage({
            enhanceApp: App => (props): JSX.Element =>
                styledComponentsSheet.collectStyles(materialSheets.collect(<App {...props} />)),
        });
    };

    const initialProps = await Document.getInitialProps(ctx);

    return {
        ...initialProps,
        styles: (
            <>
                {initialProps.styles}
                {styledComponentsSheet.getStyleElement()}
                {materialSheets.getStyleElement()}
            </>
        ),
    };
};
