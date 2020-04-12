import React from 'react';
import { compose } from 'redux';

import { SettingsLayout } from '../components';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps } from '../types';

const TermsPage: I18nPage = () => {
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

TermsPage.getInitialProps = (): I18nProps => ({
    namespacesRequired: includeDefaultNamespaces(['terms']),
});

export default compose(withApollo, withRedux)(TermsPage);
