import { Box, Typography } from '@material-ui/core';
import { LoadingLayout, SettingsLayout } from 'components';
import { useTranslation, withUserMe } from 'lib';
import { NextPage } from 'next';
import React from 'react';
import { AuthProps } from 'types';

// This page will be available also when offline.
const TermsPage: NextPage<AuthProps> = ({ authLoading }) => {
    const { t } = useTranslation();

    const renderCardContent = (
        <Box textAlign="left">
            <Typography variant="body2">{t('terms:content')}</Typography>
        </Box>
    );

    const seoProps = {
        title: t('terms:title'),
        description: t('terms:description'),
    };

    const layoutProps = {
        seoProps,
        topNavbarProps: {
            header: t('terms:header'),
            dynamicBackUrl: true,
        },
        desktopHeader: t('terms:header'),
        renderCardContent,
        infoLayout: true,
    };

    if (authLoading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    return <SettingsLayout {...layoutProps} />;
};

export default withUserMe(TermsPage);
