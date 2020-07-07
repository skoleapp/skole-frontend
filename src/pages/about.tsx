import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { withUserAgent } from 'src/lib';
import { I18nProps } from 'src/types';

import { SettingsLayout } from '../components';
import { includeDefaultNamespaces } from '../i18n';

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
