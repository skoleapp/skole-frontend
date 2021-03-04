import { ServerStyleSheets } from '@material-ui/core/styles';
import { RenderPageResult } from 'next/dist/next-server/lib/utils';
import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import React from 'react';

const SAScript = (): JSX.Element | null =>
  process.env.SA_URL ? (
    <>
      <script async defer src={`${process.env.SA_URL}/latest.js`} />
      <noscript>
        <img src={`${process.env.SA_URL}/noscript.gif`} alt="" />
      </noscript>
    </>
  ) : null;

export default class SkoleDocument extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          <SAScript />
        </body>
      </Html>
    );
  }
}

SkoleDocument.getInitialProps = async (ctx: DocumentContext): Promise<DocumentInitialProps> => {
  const originalRenderPage = ctx.renderPage;
  const sheets = new ServerStyleSheets();

  ctx.renderPage = (): RenderPageResult | Promise<RenderPageResult> =>
    originalRenderPage({
      enhanceApp: (App) => (props): JSX.Element => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  };
};
