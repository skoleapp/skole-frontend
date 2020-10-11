import { Typography } from '@material-ui/core';
import { SettingsLayout } from 'components';
import { includeDefaultNamespaces, useTranslation, withUserMe } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';

const PrivacyPage: NextPage = () => {
    const { t } = useTranslation();

    const layoutProps = {
        seoProps: {
            title: t('privacy:title'),
            description: t('privacy:description'),
        },
        header: t('privacy:header'),
        dense: true,
        topNavbarProps: {
            dynamicBackUrl: true,
        },
    };

    return (
        <SettingsLayout {...layoutProps}>
            <Typography variant="body2">{t('privacy:content')}</Typography>
        </SettingsLayout>
    );
};

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['privacy']),
    },
});

export default withUserMe(PrivacyPage);
