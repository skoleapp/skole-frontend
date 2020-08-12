import { Box, Typography } from '@material-ui/core';
import { ButtonLink, LoadingLayout, SettingsLayout } from 'components';
import { includeDefaultNamespaces, useTranslation, withUserMe } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { AuthProps } from 'types';
import { urls } from 'utils';

// This page will be available also when offline.
const AboutPage: NextPage<AuthProps> = ({ authLoading }) => {
    const { t } = useTranslation();

    const renderCardContent = (
        <Box>
            <Box textAlign="left">
                <Typography variant="body2">{t('about:content')}</Typography>
            </Box>
            <Box marginTop="2rem">
                <Typography variant="h3" gutterBottom>
                    {t('about:feedbackHeader')}
                </Typography>
                <Box marginTop="1rem">
                    <ButtonLink href={urls.contact} color="primary" variant="contained" fullWidth>
                        {t('about:feedbackText')}
                    </ButtonLink>
                </Box>
            </Box>
        </Box>
    );

    const seoProps = {
        title: t('about:title'),
        description: t('about:description'),
    };

    const layoutProps = {
        seoProps,
        topNavbarProps: {
            header: t('about:header'),
            dynamicBackUrl: true,
        },
        desktopHeader: t('about:header'),
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
        namespacesRequired: includeDefaultNamespaces(['about']),
    },
});

export default withUserMe(AboutPage);
