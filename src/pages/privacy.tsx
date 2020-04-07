import React from 'react';
import { compose } from 'redux';

import { SettingsLayout } from '../components';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps } from '../types';

const PrivacyPage: I18nPage = () => {
    const { t } = useTranslation();

    return (
        <SettingsLayout
            title={t('privacy:title')}
            heading={t('privacy:heading')}
            infoContent={t('privacy:content')}
            dynamicBackUrl
            infoLayout
        />
    );
};

PrivacyPage.getInitialProps = (): I18nProps => ({ namespacesRequired: includeDefaultNamespaces(['privacy']) });

export default compose(withRedux, withApollo)(PrivacyPage);
