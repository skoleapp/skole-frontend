import Document, { DocumentContext } from 'next/document';
import React from 'react';
import { ServerStyleSheet } from 'styled-components';

// eslint-disable-next-line
export default class SkoleDocument extends Document {
  // eslint-disable-next-line
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      // eslint-disable-next-line
      ctx.renderPage = () =>
        originalRenderPage({
          // eslint-disable-next-line
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      };
    } finally {
      sheet.seal();
    }
  }
}
