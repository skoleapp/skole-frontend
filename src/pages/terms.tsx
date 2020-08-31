import { Typography } from '@material-ui/core';
import { LoadingLayout, SettingsLayout } from 'components';
import { includeDefaultNamespaces, useTranslation, withUserMe } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { AuthProps } from 'types';

// This page will be available also when offline.
const TermsPage: NextPage<AuthProps> = ({ authLoading }) => {
    const { t } = useTranslation();

    const seoProps = {
        title: t('terms:title'),
        description: t('terms:description'),
    };

    const layoutProps = {
        seoProps,
        header: t('terms:header'),
        dense: true,
        topNavbarProps: {
            dynamicBackUrl: true,
        },
    };

    if (authLoading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

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
