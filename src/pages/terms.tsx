import React from 'react';
import { compose } from 'redux';

import { SettingsLayout } from '../components';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useAuthSync } from '../utils';

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

TermsPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['terms']) };
};

export default compose(withApollo, withRedux)(TermsPage);
