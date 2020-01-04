import Head from 'next/head';
import React from 'react';

interface Props {
    title?: string;
}

export const HeadComponent: React.FC<Props> = ({ title }) => (
    <Head>
        <title>{`Skole | ${title}`}</title>
    </Head>
);
