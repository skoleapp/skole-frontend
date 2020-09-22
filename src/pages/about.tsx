import { Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { ButtonLink, LoadingLayout, SettingsLayout } from 'components';
import { includeDefaultNamespaces, useTranslation, withUserMe } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { AuthProps } from 'types';
import { urls } from 'utils';

// This page will be available also when offline.
const AboutPage: NextPage<AuthProps> = ({ authLoading }) => {
    const { t } = useTranslation();

    const seoProps = {
        title: t('about:title'),
        description: t('about:description'),
    };

    const layoutProps = {
        seoProps,
        header: t('about:header'),
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
            <Typography variant="body2">{t('about:content')}</Typography>
            <Typography component="br" />
            <Typography variant="subtitle2">{t('about:feedbackHeader')}</Typography>
            <Typography component="br" />
            <ButtonLink
                href={urls.contact}
                color="primary"
                variant="contained"
                fullWidth
                endIcon={<ArrowForwardOutlined />}
            >
                {t('about:feedbackText')}
            </ButtonLink>
        </SettingsLayout>
    );
};

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['about']),
    },
});

export default withUserMe(AboutPage);
