import { Box, Typography } from '@material-ui/core';
import { SettingsLayout } from 'components';
import { includeDefaultNamespaces, useTranslation, withUserAgent, withUserMe } from 'lib';
import { GetServerSideProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { I18nProps } from 'types';

const faqs = [
    {
        title: 'faq:title-1',
        text: 'faq:text-1',
    },
    {
        title: 'faq:title-2',
        text: 'faq:text-2',
    },
    {
        title: 'faq:title-3',
        text: 'faq:text-3',
    },
];

const FAQPage: NextPage<I18nProps> = () => {
    const { t } = useTranslation();

    const renderCardContent = faqs.map(({ title, text }, i) => (
        <Box key={i} marginY="0.5rem" textAlign="left">
            <Typography variant="h3" gutterBottom>
                {t(title)}
            </Typography>
            <Typography variant="body2">{t(text)}</Typography>
        </Box>
    ));

    const layoutProps = {
        seoProps: {
            title: t('faq:title'),
            description: t('faq:description'),
        },
        topNavbarProps: {
            header: t('faq:header'),
            dynamicBackUrl: true,
        },
        desktopHeader: t('faq:header'),
        renderCardContent,
        infoLayout: true,
    };

    return <SettingsLayout {...layoutProps} />;
};

const wrappers = R.compose(withUserAgent, withUserMe);

export const getServerSideProps: GetServerSideProps = wrappers(async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['faq']),
    },
}));

export default FAQPage;
