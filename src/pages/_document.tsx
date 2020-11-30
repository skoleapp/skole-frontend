import { ServerStyleSheets } from '@material-ui/core';
import { RenderPageResult } from 'next/dist/next-server/lib/utils';
import NextDocument, { DocumentContext, DocumentInitialProps } from 'next/document';
import React from 'react';

export default class SkoleDocument extends NextDocument {
  static getInitialProps = async (ctx: DocumentContext): Promise<DocumentInitialProps> => {
    const originalRenderPage = ctx.renderPage;
    const sheets = new ServerStyleSheets();

    ctx.renderPage = (): RenderPageResult | Promise<RenderPageResult> =>
      originalRenderPage({
        enhanceApp: (App) => (props): JSX.Element => sheets.collect(<App {...props} />),
      });

    const initialProps = await NextDocument.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    };
  };
}
