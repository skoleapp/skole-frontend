import { PdfViewerContextProvider } from 'context';
import { NextPage } from 'next';
import React from 'react';

export const withPdfViewer = (PageComponent: NextPage): NextPage => {
  const WithPdfViewer: NextPage = (pageProps) => (
    <PdfViewerContextProvider>
      <PageComponent {...pageProps} />
    </PdfViewerContextProvider>
  );

  return WithPdfViewer;
};
