import { ServerStyleSheets } from '@material-ui/styles';
// import { documentLang } from 'lib';
import { DocumentInitialProps, RenderPageResult } from 'next/dist/next-server/lib/utils';
import NextDocument, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

export default class SkoleDocument extends NextDocument {
    render(): JSX.Element {
        return (
            <Html
            // lang={documentLang(this.props)}
            >
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

SkoleDocument.getInitialProps = async (ctx: DocumentContext): Promise<DocumentInitialProps> => {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = (): RenderPageResult | Promise<RenderPageResult> =>
        originalRenderPage({
            enhanceApp: App => (props): JSX.Element => sheets.collect(<App {...props} />),
        });

    const initialProps = await NextDocument.getInitialProps(ctx);

    return {
        ...initialProps,
        styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    };
};
