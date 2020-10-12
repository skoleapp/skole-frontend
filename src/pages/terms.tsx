import { Typography } from '@material-ui/core';
import { SettingsLayout } from 'components';
import { includeDefaultNamespaces, useTranslation, withUserMe } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';

const TermsPage: NextPage = () => {
    const { t } = useTranslation();

    const layoutProps = {
        seoProps: {
            title: t('terms:title'),
            description: t('terms:description'),
        },
        header: t('terms:header'),
        dense: true,
        topNavbarProps: {
            dynamicBackUrl: true,
        },
    };

    return (
        <SettingsLayout {...layoutProps}>
            <Typography variant="body2">{t('terms:content')}</Typography>
        </SettingsLayout>
    );
};

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['terms']),
    },
});

export default withUserMe(TermsPage);
