import { NextPage } from 'next';
import React from 'react';

import { SettingsLayout } from '../components';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo } from '../lib';

const PrivacyPage: NextPage = () => {
    const { t } = useTranslation();

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
        infoContent: t('privacy:content'),
        infoLayout: true,
    };

    return <SettingsLayout {...layoutProps} />;
};

PrivacyPage.getInitialProps = () => ({ namespacesRequired: includeDefaultNamespaces(['privacy']) });
export default withApollo(PrivacyPage);
