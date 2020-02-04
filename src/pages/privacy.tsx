import { Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from '../i18n';
import { compose } from 'redux';

import { SettingsLayout } from '../components';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useAuthSync } from '../utils';

const PrivacyPage: I18nPage = () => {
    const { t } = useTranslation();
    const renderCardContent = <Typography>Here will be privacy policy...</Typography>;
    return <SettingsLayout title={t('privacy:title')} renderCardContent={renderCardContent} backUrl />;
};

PrivacyPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['privacy']) };
};

export default compose(withRedux, withApollo)(PrivacyPage);
