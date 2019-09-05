import Head from 'next/head';
import React from 'react';

interface Props {
  title: string;
}

export const HeadComponent: React.SFC<Props> = ({ title }) => (
  <Head>
    <title>{title}</title>
    <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
    <meta name="viewport" content="initial-scale=1.2, width=device-width" key="viewport" />
  </Head>
);
