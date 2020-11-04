import { Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { ButtonLink, SettingsLayout } from 'components';
import { loadNamespaces, useTranslation, withUserMe } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { urls } from 'utils';

const AboutPage: NextPage = () => {
    const { t } = useTranslation();

    const layoutProps = {
        seoProps: {
            title: t('about:title'),
            description: t('about:description'),
        },
        header: t('about:header'),
        dense: true,
        topNavbarProps: {
            dynamicBackUrl: true,
        },
    };

    return (
        <SettingsLayout {...layoutProps}>
            <Typography variant="body2">{t('about:content')}</Typography>
            <Typography component="br" />
            <Typography variant="subtitle2">{t('about:feedbackHeader')}</Typography>
            <Typography component="br" />
            <ButtonLink href={urls.contact} color="primary" variant="contained" endIcon={<ArrowForwardOutlined />}>
                {t('about:feedbackText')}
            </ButtonLink>
        </SettingsLayout>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        _ns: await loadNamespaces(['about'], locale),
    },
});

export default withUserMe(AboutPage);
