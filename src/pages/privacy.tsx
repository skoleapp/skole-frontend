import React from 'react';
import { compose } from 'redux';

import { SettingsLayout } from '../components';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps } from '../types';

const PrivacyPage: I18nPage = () => {
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

PrivacyPage.getInitialProps = (): I18nProps => ({ namespacesRequired: includeDefaultNamespaces(['privacy']) });

export default compose(withRedux, withApollo)(PrivacyPage);
