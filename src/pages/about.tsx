import React from 'react';
import { compose } from 'redux';

import { SettingsLayout } from '../components';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useAuthSync } from '../utils';

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

AboutPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['about']) };
};

export default compose(withApollo, withRedux)(AboutPage);
