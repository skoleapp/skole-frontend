import { useTranslation } from 'lib';
import Head from 'next/head';
import React from 'react';
import { SEOProps } from 'types';

export const HeadComponent: React.FC<SEOProps> = ({ title: customTitle, description: customDescription }) => {
    const { t } = useTranslation();
    const title = `Skole | ${customTitle || t('common:slogan')}`;
    const description = customDescription || t('common:description');

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
            <meta property="og:title" content={title} />
        </Head>
    );
};
