import { Box, Typography } from '@material-ui/core';
import { SettingsLayout } from 'components';
import { withUserMe } from 'hocs';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { FAQ_ITEMS } from 'utils';

const FAQPage: NextPage = () => {
    const { t } = useTranslation();

    const renderContent = FAQ_ITEMS.map(({ title, text }, i) => (
        <Box key={i}>
            <Typography variant="subtitle2" gutterBottom>
                {t(title)}
            </Typography>
            <Typography variant="body2">{t(text)}</Typography>
            <Typography component="br" />
        </Box>
    ));

    const layoutProps = {
        seoProps: {
            title: t('faq:title'),
            description: t('faq:description'),
        },
        header: t('faq:header'),
        dense: true,
        topNavbarProps: {
            dynamicBackUrl: true,
        },
    };

    return <SettingsLayout {...layoutProps}>{renderContent}</SettingsLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        _ns: await loadNamespaces(['faq'], locale),
    },
});

export default withUserMe(FAQPage);
