import { Box, Typography } from '@material-ui/core';
import { LoadingLayout, SettingsLayout } from 'components';
import { includeDefaultNamespaces, useTranslation, withUserMe } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { AuthProps } from 'types';
import { FAQ_ITEMS } from 'utils';

// This page will be available also when offline.
const FAQPage: NextPage<AuthProps> = ({ authLoading }) => {
    const { t } = useTranslation();

    const renderCardContent = FAQ_ITEMS.map(({ title, text }, i) => (
        <Box key={i} marginY="0.5rem" textAlign="left">
            <Typography variant="h3" gutterBottom>
                {t(title)}
            </Typography>
            <Typography variant="body2">{t(text)}</Typography>
        </Box>
    ));

    const seoProps = {
        title: t('faq:title'),
        description: t('faq:description'),
    };

    const layoutProps = {
        seoProps,
        topNavbarProps: {
            header: t('faq:header'),
            dynamicBackUrl: true,
        },
        desktopHeader: t('faq:header'),
        renderCardContent,
        infoLayout: true,
    };

    if (authLoading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    return <SettingsLayout {...layoutProps} />;
};

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['faq']),
    },
});

export default withUserMe(FAQPage);
