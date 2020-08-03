import { Box, Typography } from '@material-ui/core';
import { SettingsLayout } from 'components';
import { useTranslation, withUserMe } from 'lib';
import { NextPage } from 'next';
import React from 'react';

const PrivacyPage: NextPage = () => {
    const { t } = useTranslation();

    const renderCardContent = (
        <Box textAlign="left">
            <Typography variant="body2">{t('privacy:content')}</Typography>
        </Box>
    );

    const layoutProps = {
        seoProps: {
            title: t('privacy:title'),
            description: t('privacy:description'),
        },
        topNavbarProps: {
            header: t('privacy:header'),
            dynamicBackUrl: true,
        },
        desktopHeader: t('privacy:header'),
        renderCardContent,
        infoLayout: true,
    };

    return <SettingsLayout {...layoutProps} />;
};

export default withUserMe(PrivacyPage);
