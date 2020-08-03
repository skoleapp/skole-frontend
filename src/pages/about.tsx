import { Box, Typography } from '@material-ui/core';
import { ButtonLink, SettingsLayout } from 'components';
import { useTranslation, withUserMe } from 'lib';
import { NextPage } from 'next';
import React from 'react';
import { urls } from 'utils';

const AboutPage: NextPage = () => {
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
                    <ButtonLink href={urls.contact} color="primary" variant="contained">
                        {t('about:feedbackText')}
                    </ButtonLink>
                </Box>
            </Box>
        </Box>
    );

    const layoutProps = {
        seoProps: {
            title: t('about:title'),
            description: t('about:description'),
        },
        topNavbarProps: {
            header: t('about:header'),
            dynamicBackUrl: true,
        },
        desktopHeader: t('about:header'),
        renderCardContent,
        infoLayout: true,
    };

    return <SettingsLayout {...layoutProps} />;
};

export default withUserMe(AboutPage);
