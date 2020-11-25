import { PdfViewerContextProvider } from 'context';
import { NextPage } from 'next';
import React from 'react';

// Provide PDF viewer context for child components.
export const withPdfViewer = (PageComponent: NextPage): NextPage => {
  const WithPdfViewer: NextPage = (pageProps) => (
    <PdfViewerContextProvider>
      <PageComponent {...pageProps} />
    </PdfViewerContextProvider>
  );

  return WithPdfViewer;
};
