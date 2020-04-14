import { NextPage } from 'next';
import React from 'react';

import { SettingsLayout } from '../components';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo } from '../lib';

const AboutPage: NextPage = () => {
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

AboutPage.getInitialProps = () => ({
    namespacesRequired: includeDefaultNamespaces(['about']),
});

export default withApollo(AboutPage);
