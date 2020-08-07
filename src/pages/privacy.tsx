import { Box, Typography } from '@material-ui/core';
import { LoadingLayout, SettingsLayout } from 'components';
import { useTranslation, withUserMe } from 'lib';
import { NextPage } from 'next';
import React from 'react';
import { AuthProps } from 'types';

// This page will be available also when offline.
const PrivacyPage: NextPage<AuthProps> = ({ authLoading }) => {
    const { t } = useTranslation();

    const renderCardContent = (
        <Box textAlign="left">
            <Typography variant="body2">{t('privacy:content')}</Typography>
        </Box>
    );

    const seoProps = {
        title: t('privacy:title'),
        description: t('privacy:description'),
    };

    const layoutProps = {
        seoProps,
        topNavbarProps: {
            header: t('privacy:header'),
            dynamicBackUrl: true,
        },
        desktopHeader: t('privacy:header'),
        renderCardContent,
        infoLayout: true,
    };

    if (authLoading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    return <SettingsLayout {...layoutProps} />;
};

export default withUserMe(PrivacyPage);
