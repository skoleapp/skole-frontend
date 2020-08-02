import { Box, Typography } from '@material-ui/core';
import { SettingsLayout } from 'components';
import { useTranslation, withUserMe } from 'lib';
import { NextPage } from 'next';
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

export default withUserMe(FAQPage);
