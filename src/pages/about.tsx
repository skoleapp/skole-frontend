import { Box, Button, Typography } from '@material-ui/core';
import { SettingsLayout } from 'components';
import { includeDefaultNamespaces } from 'i18n';
import { withUserAgent, withUserMe } from 'lib';
import { GetServerSideProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { I18nProps } from 'types';

const AboutPage: NextPage<I18nProps> = () => {
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
                    <Button color="primary" variant="contained">
                        {t('about:feedbackText')}
                    </Button>
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

const wrappers = R.compose(withUserAgent, withUserMe);

export const getServerSideProps: GetServerSideProps = wrappers(async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['about']),
    },
}));

export default AboutPage;
