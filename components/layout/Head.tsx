import Head from 'next/head';
import React from 'react';

interface Props {
  title?: string;
}

export const HeadComponent: React.FC<Props> = ({ title }) => (
  <Head>
    <title>{`Skole | ${title}`}</title>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </Head>
);
