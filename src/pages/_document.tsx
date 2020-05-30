import { ServerStyleSheets as MaterialUiServerStyleSheets } from '@material-ui/styles';
import { DocumentInitialProps, RenderPageResult } from 'next/dist/next-server/lib/utils';
import NextDocument, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import React, { Fragment } from 'react';
import { ServerStyleSheet as StyledComponentSheets } from 'styled-components';

export default class SkoleDocument extends NextDocument {
    render(): JSX.Element {
        return (
            <Html>
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
