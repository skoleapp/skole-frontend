import { ServerStyleSheets as MaterialUiServerStyleSheets } from '@material-ui/styles';
import { DocumentInitialProps, RenderPageResult } from 'next/dist/next-server/lib/utils';
import NextDocument, { DocumentContext, Head, Main, NextScript } from 'next/document';
import React, { Fragment } from 'react';
import { ServerStyleSheet as StyledComponentSheets } from 'styled-components';

// const GAScript = {
//     __html: `
//         window.dataLayer = window.dataLayer || [];
//         function gtag(){window.dataLayer.push(arguments)}
//         gtag("js", new Date());
//         gtag("config", "UA-159917631-1");
//     `,
// };

export default class SkoleDocument extends NextDocument {
    render(): JSX.Element {
        return (
            <html lang="en">
                <Head>
                    <meta charSet="UTF-8" />
                    <meta
                        name="viewport"
                        content="viewport-fit=cover, minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
                    />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                    <link rel="manifest" href="/manifest.json" />
                    <link rel="shortcut icon" href="/images/favicon.ico" />
                    <link rel="apple-touch-icon" sizes="180x180" href="images/icons/icon-180x180.png" />
                    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ad3636" />
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
                    {/* <script async src="https://www.googletagmanager.com/gtag/js?id=UA-159917631-1"></script>
                    <script dangerouslySetInnerHTML={GAScript} /> */}
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
