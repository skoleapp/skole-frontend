import { Box, Typography } from '@material-ui/core';
import { SettingsLayout } from 'components';
import { useTranslation, withUserMe } from 'lib';
import { NextPage } from 'next';
import React from 'react';
import { I18nProps } from 'types';

const TermsPage: NextPage<I18nProps> = () => {
    const { t } = useTranslation();

    const renderCardContent = (
        <Box textAlign="left">
            <Typography variant="body2">{t('terms:content')}</Typography>
        </Box>
    );

    const layoutProps = {
        seoProps: {
            title: t('terms:title'),
            description: t('terms:description'),
        },
        topNavbarProps: {
            header: t('terms:header'),
            dynamicBackUrl: true,
        },
        desktopHeader: t('terms:header'),
        renderCardContent,
        infoLayout: true,
    };

    return <SettingsLayout {...layoutProps} />;
};

export default withUserMe(TermsPage);
