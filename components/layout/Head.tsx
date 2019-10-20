import Head from 'next/head';
import React from 'react';

interface Props {
  title?: string;
}

export const HeadComponent: React.FC<Props> = ({ title }) => (
  <Head>
    <title>{`Skole | ${title}`}</title>
    <meta charSet="UTF-8" />
    <meta
      name="viewport"
      content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
    />
  </Head>
);
