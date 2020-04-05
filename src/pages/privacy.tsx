import React from 'react';
import { compose } from 'redux';

import { SettingsLayout } from '../components';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useAuthSync } from '../utils';

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

PrivacyPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['privacy']) };
};

export default compose(withRedux, withApollo)(PrivacyPage);
