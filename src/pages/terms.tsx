import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useAuthSync, useSettingsLayout } from '../utils';
import { withApollo, withRedux } from '../lib';

import React from 'react';
import { Typography } from '@material-ui/core';
import { compose } from 'redux';
import { includeDefaultNamespaces } from '../i18n';
import { useTranslation } from 'react-i18next';

const TermsPage: I18nPage = () => {
    const { t } = useTranslation();

    const renderCardContent = <Typography>Here will be terms and conditions...</Typography>;

    const responsiveSettingsProps = {
        title: t('terms:title'),
        renderCardContent,
    };

    return useSettingsLayout(responsiveSettingsProps);
};

TermsPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['terms']) };
};

export default compose(withApollo, withRedux)(TermsPage);
