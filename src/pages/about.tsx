import { SettingsLayout } from 'components';
import { includeDefaultNamespaces } from 'i18n';
import { withUserAgent } from 'lib';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { I18nProps } from 'types';

const AboutPage: NextPage<I18nProps> = () => {
    const { t } = useTranslation();

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
        infoContent: t('terms:content'),
        infoLayout: true,
    };

    return <SettingsLayout {...layoutProps} />;
};

export const getServerSideProps: GetServerSideProps = withUserAgent(async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['about']),
    },
}));

export default AboutPage;
