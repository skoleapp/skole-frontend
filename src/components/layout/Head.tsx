import { useTranslation } from 'lib';
import Head from 'next/head';
import React from 'react';
import { colors } from 'styles';
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
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Skole" />
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0, maximum-scale=1 user-scalable=no viewport-fit=cover"
            />
            <meta name="theme-color" content={colors.primary} />
            <meta content="yes" name="mobile-web-app-capable" />
            <meta name="apple-mobile-web-app-title" content="Skole" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        </Head>
    );
};
