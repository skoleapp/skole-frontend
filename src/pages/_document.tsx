import { ServerStyleSheets } from '@material-ui/styles';
import { DocumentInitialProps, RenderPageResult } from 'next/dist/next-server/lib/utils';
import NextDocument, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import * as R from 'ramda';
import React from 'react';

interface Props {
    lang: string;
}

export default class SkoleDocument extends NextDocument<Props> {
    render(): JSX.Element {
        return (
            <Html lang={this.props.lang}>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

SkoleDocument.getInitialProps = async (ctx: DocumentContext): Promise<DocumentInitialProps & Props> => {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = (): RenderPageResult | Promise<RenderPageResult> =>
        originalRenderPage({
            enhanceApp: App => (props): JSX.Element => sheets.collect(<App {...props} />),
        });

    const initialProps = await NextDocument.getInitialProps(ctx);
    const lang = R.pathOr('', ['req', 'language'], ctx);

    return {
        ...initialProps,
        lang,
        styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    };
};
