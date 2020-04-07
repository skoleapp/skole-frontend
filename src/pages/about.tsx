import React from 'react';
import { compose } from 'redux';

import { SettingsLayout } from '../components';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps } from '../types';

const AboutPage: I18nPage = () => {
    const { t } = useTranslation();

    return (
        <SettingsLayout
            title={t('about:title')}
            heading={t('about:heading')}
            infoContent={t('about:content')}
            dynamicBackUrl
            infoLayout
        />
    );
};

AboutPage.getInitialProps = (): I18nProps => ({
    namespacesRequired: includeDefaultNamespaces(['about']),
});

export default compose(withApollo, withRedux)(AboutPage);
