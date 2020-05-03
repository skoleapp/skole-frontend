import { Box, Typography } from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { I18nProps } from 'src/types';

import { SettingsLayout } from '../components';
import { includeDefaultNamespaces } from '../i18n';

// TODO: Add FAQs here.
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
        <Box key={i} marginTop="0.5rem">
            <Typography variant="subtitle1">{t(title)}</Typography>
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

export const getServerSideProps: GetServerSideProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['faq']),
    },
});

export default FAQPage;
