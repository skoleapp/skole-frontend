import { DragContextProvider } from 'context';
import { NextPage } from 'next';
import React from 'react';

export const withDrag = (PageComponent: NextPage): NextPage => {
  const WithDrag: NextPage = (pageProps) => (
    <DragContextProvider>
      <PageComponent {...pageProps} />
    </DragContextProvider>
  );

  return WithDrag;
};
