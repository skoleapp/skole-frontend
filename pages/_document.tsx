import { ServerStyleSheets } from '@material-ui/styles';
import { RenderPageResult } from 'next/dist/next-server/lib/utils';
import Document, { DocumentContext, Head, Main, NextScript } from 'next/document';
import React from 'react';
import { ServerStyleSheet } from 'styled-components';

export default class SkoleDocument extends Document {
  render(): JSX.Element {
    return (
      <html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
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

// eslint-disable-next-line
SkoleDocument.getInitialProps = async (ctx: DocumentContext): Promise<any> => {
  const styledComponentsSheet = new ServerStyleSheet();
  const materialSheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  try {
    ctx.renderPage = (): RenderPageResult | Promise<RenderPageResult> =>
      originalRenderPage({
        enhanceApp: App => (
          props: any // eslint-disable-line
          // eslint-disable-next-line
        ): any => styledComponentsSheet.collectStyles(materialSheets.collect(<App {...props} />))
      });
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {materialSheets.getStyleElement()}
          {styledComponentsSheet.getStyleElement()}
        </>
      )
    };
  } finally {
    styledComponentsSheet.seal();
  }
};
