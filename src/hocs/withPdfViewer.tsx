import { PdfViewerContextProvider } from 'context';
import { NextPage } from 'next';
import React from 'react';

// Provide PDF viewer context for child components.
export const withPdfViewer = <T extends Record<symbol, unknown>>(
  PageComponent: NextPage<T>
): NextPage => {
  const WithPdfViewer: NextPage = (pageProps) => (
    <PdfViewerContextProvider>
      <PageComponent {...(pageProps as T)} />
    </PdfViewerContextProvider>
  );

  return WithPdfViewer;
};
