import Head from 'next/head';
import React from 'react';

import { SEOProps } from '../../types';

export const HeadComponent: React.FC<SEOProps> = ({ title, description }) => (
    <Head>
        <title>{`Skole | ${title}`}</title>
        <meta name="description" content={description}></meta>
    </Head>
);
