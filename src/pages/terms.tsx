import { NextPage } from 'next';
import React from 'react';

import { SettingsLayout } from '../components';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo } from '../lib';

const TermsPage: NextPage = () => {
    const { t } = useTranslation();

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
        infoContent: t('terms:content'),
        infoLayout: true,
    };

    return <SettingsLayout {...layoutProps} />;
};

TermsPage.getInitialProps = () => ({
    namespacesRequired: includeDefaultNamespaces(['terms']),
});

export default withApollo(TermsPage);
