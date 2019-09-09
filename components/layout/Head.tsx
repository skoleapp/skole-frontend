import Head from 'next/head';
import React from 'react';

interface Props {
  title?: string;
}

export const HeadComponent: React.FC<Props> = ({ title }) => (
  <Head>
    <title>{`Skole` && title ? title : ``}</title>
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
  </Head>
);
