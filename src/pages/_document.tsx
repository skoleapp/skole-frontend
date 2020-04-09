import { ServerStyleSheets as MaterialUiServerStyleSheets } from '@material-ui/styles';
import { DocumentInitialProps, RenderPageResult } from 'next/dist/next-server/lib/utils';
import NextDocument, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import React, { Fragment } from 'react';
import { GA_TRACKING_ID } from 'src/lib';
import { ServerStyleSheet as StyledComponentSheets } from 'styled-components';

const GAScript = {
    __html: `
        window.dataLayer = window.dataLayer || [];

        function gtag(){
            dataLayer.push(arguments);
        };

        gtag('js', new Date());

        gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
        });
    `,
};

export default class SkoleDocument extends NextDocument {
    render(): JSX.Element {
        return (
            <Html>
                <Head>
                    <meta charSet="utf-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
                    <meta name="theme-color" content="#ad3636" />
                    <meta name="apple-mobile-web-app-title" content="Skole" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                    <link rel="shortcut icon" href="/images/favicon.ico" />
                    <link rel="apple-touch-icon" sizes="180x180" href="images/icons/icon-180x180.png" />
                    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ad3636" />
                    <link rel="manifest" href="/manifest.json" />
                    <link
                        href="images/splashscreens/iphone5_splash.png"
                        media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
                        rel="apple-touch-startup-image"
                    />
                    <link
                        href="images/splashscreens/iphone6_splash.png"
                        media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
                        rel="apple-touch-startup-image"
                    />
                    <link
                        href="images/splashscreens/iphoneplus_splash.png"
                        media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)"
                        rel="apple-touch-startup-image"
                    />
                    <link
                        href="images/splashscreens/iphonex_splash.png"
                        media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
                        rel="apple-touch-startup-image"
                    />
                    <link
                        href="images/splashscreens/iphonexr_splash.png"
                        media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
                        rel="apple-touch-startup-image"
                    />
                    <link
                        href="images/splashscreens/iphonexsmax_splash.png"
                        media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
                        rel="apple-touch-startup-image"
                    />
                    <link
                        href="images/splashscreens/ipad_splash.png"
                        media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
                        rel="apple-touch-startup-image"
                    />
                    <link
                        href="images/splashscreens/ipadpro1_splash.png"
                        media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
                        rel="apple-touch-startup-image"
                    />
                    <link
                        href="images/splashscreens/ipadpro3_splash.png"
                        media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
                        rel="apple-touch-startup-image"
                    />
                    <link
                        href="images/splashscreens/ipadpro2_splash.png"
                        media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
                        rel="apple-touch-startup-image"
                    />
                    <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
                    <script dangerouslySetInnerHTML={GAScript} />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

SkoleDocument.getInitialProps = async (ctx: DocumentContext): Promise<DocumentInitialProps> => {
    const styledComponentSheet = new StyledComponentSheets();
    const materialUiSheets = new MaterialUiServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    try {
        ctx.renderPage = (): RenderPageResult | Promise<RenderPageResult> =>
            originalRenderPage({
                enhanceApp: App => (props): JSX.Element =>
                    styledComponentSheet.collectStyles(materialUiSheets.collect(<App {...props} />)),
            });

        const initialProps = await NextDocument.getInitialProps(ctx);

        return {
            ...initialProps,
            styles: [
                <Fragment key="styles">
                    {initialProps.styles}
                    {materialUiSheets.getStyleElement()}
                    {styledComponentSheet.getStyleElement()}
                </Fragment>,
            ],
        };
    } finally {
        styledComponentSheet.seal();
    }
};
