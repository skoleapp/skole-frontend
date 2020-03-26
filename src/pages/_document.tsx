import { ServerStyleSheets } from '@material-ui/styles';
import { DocumentInitialProps, RenderPageResult } from 'next/dist/next-server/lib/utils';
import Document, { DocumentContext, Head, Main, NextScript } from 'next/document';
import React from 'react';
import { ServerStyleSheet } from 'styled-components';

export default class SkoleDocument extends Document {
    render(): JSX.Element {
        return (
            <html lang="en">
                <Head>
                    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-159917631-1"></script>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments)}
        gtag("js", new Date());
        gtag("config", "UA-159917631-1");
    `,
                        }}
                    ></script>
                    <meta charSet="UTF-8" />
                    <meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
                    />
                    <link rel="manifest" href="/manifest.json" />
                    <link rel="shortcut icon" href="/images/favicon.ico" />
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
