import React from 'react';
import { compose } from 'redux';

import { SettingsLayout } from '../components';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps } from '../types';

const TermsPage: I18nPage = () => {
    const { t } = useTranslation();

    return (
        <SettingsLayout
            title={t('terms:title')}
            heading={t('terms:heading')}
            infoContent={t('terms:content')}
            dynamicBackUrl
            infoLayout
        />
    );
};

TermsPage.getInitialProps = (): I18nProps => ({
    namespacesRequired: includeDefaultNamespaces(['terms']),
});

export default compose(withApollo, withRedux)(TermsPage);
