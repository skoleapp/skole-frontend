import { Typography } from '@material-ui/core';
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
    const renderCardContent = <Typography>Here will be terms and conditions...</Typography>;
    return <SettingsLayout title={t('terms:title')} renderCardContent={renderCardContent} backUrl />;
};

TermsPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['terms']) };
};

export default compose(withApollo, withRedux)(TermsPage);
